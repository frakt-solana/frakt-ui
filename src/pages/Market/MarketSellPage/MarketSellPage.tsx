import { useParams } from 'react-router';
import { FC, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { PublicKey } from '@solana/web3.js';

import { AppLayout } from '../../../components/Layout/AppLayout';
import { HeaderSell } from './components/HeaderSell';
import { SellingModal } from './components/SellingModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { UserNFT, useUserTokens } from '../../../contexts/userTokens';
import styles from './styles.module.scss';
import {
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { usePublicKeyParam } from '../../../hooks';
import { MarketNFTsList, SORT_VALUES } from '../components/MarketNFTsList';
import { Loader } from '../../../components/Loader';
import { FilterFormInputsNames } from '../model';
import { useNFTsFiltering } from '../hooks';
import { SidebarInner } from '../components/SidebarInner';

export const MarketSellPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  useNftPoolsInitialFetch();

  const { depositNftToCommunityPool } = useNftPools();

  const { pool, whitelistedMintsDictionary } = useNftPool(poolPubkey);
  const { connected } = useWallet();

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
  const onSell = () => {
    //TODO Remove NFT from list after successfull selling
    depositNftToCommunityPool({
      pool,
      nftMint: new PublicKey(selectedNft?.mint),
      afterTransaction: () => {
        removeTokenOptimistic([selectedNft?.mint]);
        onDeselect();
      },
    });
  };

  const rawNFTs = useMemo(() => {
    return rawNfts.filter(({ mint }) => !!whitelistedMintsDictionary[mint]);
  }, [rawNfts, whitelistedMintsDictionary]);

  const loading = userTokensLoading || nftsLoading;

  const { control, nfts, setSearch } = useNFTsFiltering(rawNFTs);

  return (
    <AppLayout className={styles.layout}>
      <div className={styles.modalWrapper}>
        <SellingModal
          nft={selectedNft}
          onDeselect={onDeselect}
          onSubmit={onSell}
        />
      </div>
      <div className="container">
        <Helmet>
          <title>Market/Buy-NFT | FRAKT: A NFT-DeFi ecosystem on Solana</title>
        </Helmet>
        <div className={styles.wrapper}>
          <SidebarInner
            isSidebar={isSidebar}
            setIsSidebar={setIsSidebar}
            setSearch={setSearch}
          />

          <div className={styles.content}>
            <HeaderSell poolPublicKey={poolPubkey} />

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
        </div>
      </div>
    </AppLayout>
  );
};
