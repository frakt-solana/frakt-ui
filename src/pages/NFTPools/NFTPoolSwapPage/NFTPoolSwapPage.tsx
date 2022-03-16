import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

import styles from './NFTPoolSwapPage.module.scss';
import { HeaderSwap } from './components/HeaderSwap';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { usePublicKeyParam } from '../../../hooks';
import {
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
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
import { LotteryModal, useLotteryModal } from '../components/LotteryModal';
import { getNftImagesForLottery } from '../NFTPoolBuyPage';
import { safetyDepositBoxWithNftMetadataToUserNFT } from '../../../utils/cacher/nftPools/nftPools.helpers';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';

export const NFTPoolSwapPage: FC = () => {
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
  const [, setIsSidebar] = useState<boolean>(false);

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

  const loading = userTokensLoading || nftsLoading || poolLoading;

  const { control, nfts } = useNFTsFiltering(rawNFTs);

  const { balance } = useNftPoolTokenBalance(pool);
  const poolTokenAvailable = balance >= 1;

  const Header = () => <HeaderSwap poolPublicKey={poolPubkey} />;

  return (
    <NFTPoolPageLayout CustomHeader={loading ? null : Header}>
      {!connected && <WalletNotConnected />}
      {connected && !loading && (
        <NFTPoolNFTsList
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

      <div className={styles.modalWrapper}>
        <SwapModal
          nft={selectedNft}
          onDeselect={onDeselect}
          onSubmit={onSwap}
          randomPoolImage={poolImage}
          poolTokenAvailable={poolTokenAvailable}
        />
      </div>
      {isLotteryModalVisible && (
        <LotteryModal
          setIsVisible={setIsLotteryModalVisible}
          prizeImg={prizeImg}
          setPrizeImg={setPrizeImg}
          nftImages={getNftImagesForLottery(poolNfts)}
        />
      )}
    </NFTPoolPageLayout>
  );
};
