import { FC, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';

import styles from './NFTPoolSwapPage.module.scss';
import { HeaderSwap } from './components/HeaderSwap';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { useConnection, usePublicKeyParam } from '../../../hooks';
import {
  filterWhitelistedNFTs,
  useNftPool,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { UserNFT, useUserTokens } from '../../../contexts/userTokens';
import {
  useAPR,
  useNftPoolTokenBalance,
  useNFTsFiltering,
  usePoolPubkeyParam,
  usePoolTokensPrices,
  useUserRawNfts,
} from '../hooks';
import { FilterFormInputsNames } from '../model';
import { Loader } from '../../../components/Loader';
import { SwapModal } from './components/SwapModal';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import { useTokenListContext } from '../../../contexts/TokenList';

import { useLiquidityPools } from '../../../contexts/liquidityPools';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../components/LoadingModal';
import { SELL_COMMISSION_PERCENT } from '../constants';
import { POOL_TABS } from '../../../constants';
import { swapNft } from '../transactions';

const useNftsSwap = ({
  pool,
  poolTokenInfo,
}: {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
}) => {
  const wallet = useWallet();
  const { poolDataByMint } = useLiquidityPools();
  const connection = useConnection();
  const { removeTokenOptimistic } = useUserTokens();
  const { balance } = useNftPoolTokenBalance(pool);
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const [slippage, setSlippage] = useState<number>(0.5);
  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);

  const swap = async (needSwap = false) => {
    try {
      openLoadingModal();

      const poolData = poolDataByMint.get(poolTokenInfo.address);

      const result = await swapNft({
        pool,
        poolToken: poolTokenInfo,
        nft: selectedNft,
        connection,
        wallet,
        raydiumLiquidityPoolKeys: poolData?.poolConfig,
        swapSlippage: slippage,
        needSwap,
      });

      if (!result) {
        throw new Error('Swap failed');
      }

      removeTokenOptimistic([selectedNft?.mint]);
      onDeselect();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const onSelect = (nft: UserNFT) => {
    setSelectedNft((prevNft) => (prevNft?.mint === nft.mint ? null : nft));
  };
  const onDeselect = () => {
    setSelectedNft(null);
  };

  return {
    slippage,
    setSlippage,
    swap,
    poolTokenBalance: balance,
    onSelect,
    onDeselect,
    selectedNft,
    loadingModalVisible,
    closeLoadingModal,
  };
};

export const NFTPoolSwapPage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);

  useNftPoolsInitialFetch();

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
    slippage,
    setSlippage,
    swap,
    poolTokenBalance: balance,
    onSelect,
    onDeselect,
    selectedNft,
    loadingModalVisible,
    closeLoadingModal,
  } = useNftsSwap({ pool, poolTokenInfo });

  const { rawNfts, rawNftsLoading: contentLoading } = useUserRawNfts();

  const {
    pricesByTokenMint: poolTokenPricesByTokenMint,
    loading: pricesLoading,
  } = usePoolTokensPrices([poolTokenInfo]);

  const [, setIsSidebar] = useState<boolean>(false);

  const whitelistedNFTs = useMemo(() => {
    return filterWhitelistedNFTs(
      rawNfts || [],
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    );
  }, [rawNfts, whitelistedMintsDictionary, whitelistedCreatorsDictionary]);

  const { control, nfts } = useNFTsFiltering(whitelistedNFTs);

  const { loading: aprLoading } = useAPR();

  const poolTokenAvailable = balance >= SELL_COMMISSION_PERCENT / 100;

  const pageLoading =
    poolLoading || tokensMapLoading || pricesLoading || aprLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderSwap
          pool={pool}
          poolTokenInfo={poolTokenInfo}
          poolTokenPrice={
            poolTokenPricesByTokenMint?.get(poolTokenInfo?.address)?.buy
          }
          hidden={pageLoading}
        />
      }
      tab={POOL_TABS.SWAP}
    >
      {pageLoading ? (
        <Loader size="large" />
      ) : (
        <>
          {!connected && <WalletNotConnected type="swap" />}
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
            <SwapModal
              nft={selectedNft}
              onDeselect={onDeselect}
              onSubmit={swap}
              randomPoolImage={poolTokenInfo?.logoURI}
              poolTokenAvailable={poolTokenAvailable}
              poolTokenInfo={poolTokenInfo}
              poolTokenPrice={
                poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.buy
              }
              slippage={slippage}
              setSlippage={setSlippage}
            />
          </div>
          <LoadingModal
            title="Please approve transaction"
            visible={loadingModalVisible}
            onCancel={closeLoadingModal}
          />
        </>
      )}
    </NFTPoolPageLayout>
  );
};
