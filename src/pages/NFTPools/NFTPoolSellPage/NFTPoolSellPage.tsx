import { FC, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';

import { HeaderSell } from './components/HeaderSell';
import { SellingModal } from './components/SellingModal';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { UserNFT } from '../../../state/userTokens/types';
import styles from './NFTPoolSellPage.module.scss';
import {
  filterWhitelistedNFTs,
  useNftPool,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { useConnection, usePublicKeyParam } from '../../../hooks';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { Loader } from '../../../components/Loader';
import { FilterFormInputsNames } from '../model';
import {
  useAPR,
  useNFTsFiltering,
  usePoolPubkeyParam,
  usePoolTokensPrices,
  useUserRawNfts,
} from '../hooks';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import { selectTokenListState } from '../../../state/tokenList/selectors';
import { useLiquidityPools } from '../../../contexts/liquidityPools';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../components/LoadingModal';
import { userTokensActions } from '../../../state/userTokens/actions';
import { POOL_TABS } from '../../../constants';
import { sellNft } from '../transactions';

const useNftSell = ({
  pool,
  poolTokenInfo,
}: {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
}) => {
  const wallet = useWallet();
  const { poolDataByMint } = useLiquidityPools();
  const connection = useConnection();
  const dispatch = useDispatch();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const [slippage, setSlippage] = useState<number>(0.5);
  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);

  const sell = async (needSwap = false) => {
    try {
      openLoadingModal();

      const poolData = poolDataByMint.get(poolTokenInfo.address);

      const result = await sellNft({
        pool,
        nft: selectedNft,
        poolToken: poolTokenInfo,
        connection,
        wallet,
        raydiumLiquidityPoolKeys: poolData?.poolConfig,
        swapSlippage: slippage,
        needSwap,
      });

      if (!result) {
        throw new Error('Sell failed');
      }

      dispatch(userTokensActions.removeTokenOptimistic([selectedNft?.mint]));
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
    sell,
    onSelect,
    onDeselect,
    selectedNft,
    loadingModalVisible,
    closeLoadingModal,
  };
};

export const NFTPoolSellPage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();

  const { connected } = useWallet();

  const {
    pool,
    whitelistedMintsDictionary,
    whitelistedCreatorsDictionary,
    loading: poolLoading,
  } = useNftPool(poolPubkey);

  const poolPublicKey = pool?.publicKey?.toBase58();
  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useSelector(selectTokenListState);

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const { rawNfts, rawNftsLoading: contentLoading } = useUserRawNfts();

  const {
    pricesByTokenMint: poolTokenPricesByTokenMint,
    loading: pricesLoading,
  } = usePoolTokensPrices([poolTokenInfo]);

  const {
    slippage,
    setSlippage,
    onSelect,
    onDeselect,
    selectedNft,
    sell,
    loadingModalVisible,
    closeLoadingModal,
  } = useNftSell({ pool, poolTokenInfo });

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

  const pageLoading =
    tokensMapLoading || poolLoading || pricesLoading || aprLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderSell
          pool={pool}
          poolTokenInfo={poolTokenInfo}
          poolTokenPrice={
            poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.sell
          }
          hidden={pageLoading}
        />
      }
      tab={POOL_TABS.SELL}
    >
      {pageLoading ? (
        <Loader size="large" />
      ) : (
        <>
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
              onSubmit={sell}
              poolTokenInfo={poolTokenInfo}
              poolTokenPrice={
                poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.sell
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
