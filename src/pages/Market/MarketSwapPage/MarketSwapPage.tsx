import { FC, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';

import styles from './styles.module.scss';
import { AppLayout } from '../../../components/Layout/AppLayout';
import { HeaderSwap } from './components/HeaderSwap';
import { MarketNFTsList, SORT_VALUES } from '../components/MarketNFTsList';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { useParams } from 'react-router-dom';
import { usePublicKeyParam } from '../../../hooks';
import {
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { SidebarInner } from '../components/SidebarInner';
import { UserNFT, useUserTokens } from '../../../contexts/userTokens';
import {
  useLotteryTicketSubscription,
  useNftPoolTokenBalance,
  useNFTsFiltering,
} from '../hooks';
import { FilterFormInputsNames } from '../model';
import { Loader } from '../../../components/Loader';
import { SwapModal } from './components/SwapModal';
import { SafetyDepositBoxState } from '../../../utils/cacher/nftPools';
import { PublicKey } from '@solana/web3.js';
import { LotteryModal, useLotteryModal } from '../components/LotteryModal';
import { getNftImagesForLottery } from '../MarketBuyPage';
import { safetyDepositBoxWithNftMetadataToUserNFT } from '../../../utils/cacher/nftPools/nftPools.helpers';

export const MarketSwapPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  useNftPoolsInitialFetch();

  const {
    pool,
    whitelistedMintsDictionary,
    loading: poolLoading,
  } = useNftPool(poolPubkey);
  const { connected } = useWallet();
  const { swapNft } = useNftPools();
  const { subscribe } = useLotteryTicketSubscription();

  const poolImage = pool?.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  const poolNfts = useMemo(() => {
    if (pool) {
      return pool.safetyBoxes.map((safetyBox) => ({
        ...safetyDepositBoxWithNftMetadataToUserNFT(safetyBox),
        collectionName: safetyBox?.nftCollectionName || '',
      }));
    }
    return [];
  }, [pool]);

  const {
    nfts: rawNfts,
    loading: userTokensLoading,
    nftsLoading,
    fetchUserNfts,
    rawUserTokensByMint,
    removeTokenOptimistic,
  } = useUserTokens();

  useEffect(() => {
    if (
      connected &&
      !userTokensLoading &&
      !nftsLoading &&
      Object.keys(rawUserTokensByMint).length
    ) {
      fetchUserNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, userTokensLoading, nftsLoading]);

  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);
  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const onSelect = (nft: UserNFT) => {
    setSelectedNft((prevNft) => (prevNft?.mint === nft.mint ? null : nft));
  };
  const onDeselect = () => {
    setSelectedNft(null);
  };

  const {
    isLotteryModalVisible,
    setIsLotteryModalVisible,
    prizeImg,
    setPrizeImg,
    openLotteryModal,
  } = useLotteryModal();

  const onSwap = async () => {
    const lotteryTicketPubkey = await swapNft({
      pool,
      nftMint: new PublicKey(selectedNft?.mint),
      afterDepositNftTransaction: () => {
        removeTokenOptimistic([selectedNft?.mint]);
        onDeselect();
      },
    });
    openLotteryModal();

    lotteryTicketPubkey &&
      subscribe(lotteryTicketPubkey, (saferyBoxPublicKey) => {
        if (saferyBoxPublicKey === '11111111111111111111111111111111') {
          return;
        }

        const nftImage =
          pool.safetyBoxes.find(
            ({ publicKey }) => publicKey.toBase58() === saferyBoxPublicKey,
          )?.nftImage || '';

        setPrizeImg(nftImage);
      });
  };

  const rawNFTs = useMemo(() => {
    return rawNfts.filter(({ mint }) => !!whitelistedMintsDictionary[mint]);
  }, [rawNfts, whitelistedMintsDictionary]);

  const loading = userTokensLoading || nftsLoading;

  const { control, nfts, setSearch } = useNFTsFiltering(rawNFTs);

  const { balance } = useNftPoolTokenBalance(pool);
  const poolTokenAvailable = balance >= 1;

  return (
    <AppLayout className={styles.layout}>
      <div className="container">
        <Helmet>
          <title>{`Market/Buy-NFT | FRAKT: A NFT-DeFi ecosystem on Solana`}</title>
        </Helmet>

        <div className={styles.wrapper}>
          {poolLoading || !pool ? (
            <Loader size="large" />
          ) : (
            <>
              <SidebarInner
                isSidebar={isSidebar}
                setIsSidebar={setIsSidebar}
                setSearch={setSearch}
              />
              <div className={styles.modalWrapper}>
                <SwapModal
                  nft={selectedNft}
                  onDeselect={onDeselect}
                  onSubmit={onSwap}
                  randomPoolImage={poolImage}
                  poolTokenAvailable={poolTokenAvailable}
                />
              </div>
              <div className={styles.content}>
                <HeaderSwap poolPublicKey={poolPubkey} />
                {!connected && <WalletNotConnected />}
                {connected && !loading && (
                  <MarketNFTsList
                    nfts={nfts}
                    setIsSidebar={setIsSidebar}
                    control={control}
                    sortFieldName={FilterFormInputsNames.SORT}
                    sortValues={SORT_VALUES}
                    onCardClick={onSelect}
                    selectedNft={selectedNft}
                  />
                )}
                {connected && loading && <Loader size="large" />}
              </div>
            </>
          )}
        </div>
      </div>
      {isLotteryModalVisible && (
        <LotteryModal
          setIsVisible={setIsLotteryModalVisible}
          prizeImg={prizeImg}
          setPrizeImg={setPrizeImg}
          nftImages={getNftImagesForLottery(poolNfts)}
        />
      )}
    </AppLayout>
  );
};
