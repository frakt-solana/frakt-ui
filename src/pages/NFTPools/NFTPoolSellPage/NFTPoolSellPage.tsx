import { useParams } from 'react-router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { HeaderSell } from './components/HeaderSell';
import { SellingModal } from './components/SellingModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { UserNFT, useUserTokens } from '../../../contexts/userTokens';
import styles from './NFTPoolSellPage.module.scss';
import {
  filterWhitelistedNFTs,
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { usePublicKeyParam } from '../../../hooks';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { Loader } from '../../../components/Loader';
import { FilterFormInputsNames } from '../model';
import { useNftPoolTokenBalance, useNFTsFiltering } from '../hooks';
import {
  NFTPoolPageLayout,
  PoolPageType,
} from '../components/NFTPoolPageLayout';
import { useTokenListContext } from '../../../contexts/TokenList';

export const NFTPoolSellPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
  usePublicKeyParam(poolPubkey);

  useNftPoolsInitialFetch();

  const { depositNftToCommunityPool } = useNftPools();

  const {
    pool,
    whitelistedMintsDictionary,
    whitelistedCreatorsDictionary,
    loading: poolLoading,
  } = useNftPool(poolPubkey);

  const poolPublicKey = pool?.publicKey?.toBase58();
  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

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
      nft: selectedNft,
      afterTransaction: () => {
        removeTokenOptimistic([selectedNft?.mint]);
        onDeselect();
      },
    });
  };

  const whitelistedNFTs = useMemo(() => {
    return filterWhitelistedNFTs(
      rawNfts,
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    );
  }, [rawNfts, whitelistedMintsDictionary, whitelistedCreatorsDictionary]);

  const contentLoading = userTokensLoading || nftsLoading;

  const { control, nfts } = useNFTsFiltering(whitelistedNFTs);

  const { balance } = useNftPoolTokenBalance(pool);
  const poolTokenAvailable = balance >= 1;

  const Header = useCallback(
    () => (
      <HeaderSell poolPublicKey={poolPubkey} poolTokenInfo={poolTokenInfo} />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [poolPublicKey],
  );

  const pageLoading = tokensMapLoading || poolLoading;

  return (
    <NFTPoolPageLayout
      CustomHeader={pageLoading ? null : Header}
      pageType={PoolPageType.SELL}
    >
      {!connected && <WalletNotConnected type="sell" />}
      {connected && !contentLoading && (
        <NFTPoolNFTsList
          nfts={nfts}
          setIsSidebar={setIsSidebar}
          control={control}
          sortFieldName={FilterFormInputsNames.SORT}
          sortValues={SORT_VALUES}
          onCardClick={onSelect}
          selectedNft={selectedNft}
          poolName={poolTokenInfo?.name}
        />
      )}
      {connected && contentLoading && <Loader size="large" />}
      <div className={styles.modalWrapper}>
        <SellingModal
          nft={selectedNft}
          onDeselect={onDeselect}
          onSubmit={onSell}
          poolTokenAvailable={poolTokenAvailable}
          poolTokenInfo={poolTokenInfo}
        />
      </div>
    </NFTPoolPageLayout>
  );
};
