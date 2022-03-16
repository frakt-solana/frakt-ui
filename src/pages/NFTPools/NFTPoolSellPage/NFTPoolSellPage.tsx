import { useParams } from 'react-router';
import { FC, useEffect, useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

import { HeaderSell } from './components/HeaderSell';
import { SellingModal } from './components/SellingModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { UserNFT, useUserTokens } from '../../../contexts/userTokens';
import styles from './NFTPoolSellPage.module.scss';
import {
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { usePublicKeyParam } from '../../../hooks';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { Loader } from '../../../components/Loader';
import { FilterFormInputsNames } from '../model';
import { useNftPoolTokenBalance, useNFTsFiltering } from '../hooks';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';

export const NFTPoolSellPage: FC = () => {
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
  const [, setIsSidebar] = useState<boolean>(false);

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

  const { control, nfts } = useNFTsFiltering(rawNFTs);

  const { balance } = useNftPoolTokenBalance(pool);
  const poolTokenAvailable = balance >= 1;

  const Header = () => <HeaderSell poolPublicKey={poolPubkey} />;

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
        <SellingModal
          nft={selectedNft}
          onDeselect={onDeselect}
          onSubmit={onSell}
          poolTokenAvailable={poolTokenAvailable}
        />
      </div>
    </NFTPoolPageLayout>
  );
};
