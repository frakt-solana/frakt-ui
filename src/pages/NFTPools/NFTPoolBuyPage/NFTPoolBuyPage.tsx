import { FC, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';

import { HeaderBuy } from './components/HeaderBuy';
import { usePublicKeyParam } from '../../../hooks';
import {
  useNftPool,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../../contexts/nftPools';
import { Loader } from '../../../components/Loader';
import { UserNFTWithCollection } from '../../../contexts/userTokens';
import { safetyDepositBoxWithNftMetadataToUserNFT } from '../../../utils/cacher/nftPools/nftPools.helpers';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import {
  useAPR,
  useNFTsFiltering,
  usePoolPubkeyParam,
  usePoolTokensPrices,
} from '../hooks';
import { FilterFormInputsNames } from '../model';
import { NFTPoolPageLayout } from '../components/NFTPoolPageLayout';
import { useTokenListContext } from '../../../contexts/TokenList';
import { useLiquidityPools } from '../../../contexts/liquidityPools';

import { NftPoolData } from '../../../utils/cacher/nftPools';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../components/LoadingModal';
import { POOL_TABS } from '../../../constants';
import { buyRandomNft } from '../transactions';

const useNftBuy = ({
  pool,
  poolTokenInfo,
}: {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
}) => {
  const { poolDataByMint } = useLiquidityPools();
  const wallet = useWallet();
  const { connection } = useConnection();
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const [slippage, setSlippage] = useState<number>(0.5);

  const buy = async (needSwap = false) => {
    try {
      openLoadingModal();

      const poolData = poolDataByMint.get(poolTokenInfo.address);

      const result = await buyRandomNft({
        pool,
        poolToken: poolTokenInfo,
        connection,
        wallet,
        raydiumLiquidityPoolKeys: poolData?.poolConfig,
        swapSlippage: slippage,
        needSwap,
      });
      if (!result) {
        throw new Error('Buy failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    buy,
    loadingModalVisible,
    closeLoadingModal,
    slippage,
    setSlippage,
  };
};

export const NFTPoolBuyPage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const { pool, loading: poolLoading } = useNftPool(poolPubkey);
  const poolPublicKey = pool?.publicKey?.toBase58();

  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const {
    pricesByTokenMint: poolTokenPricesByTokenMint,
    loading: pricesLoading,
  } = usePoolTokensPrices([poolTokenInfo]);

  const [, setIsSidebar] = useState<boolean>(false);

  const rawNFTs: UserNFTWithCollection[] = useMemo(() => {
    if (pool) {
      return pool.safetyBoxes.map((safetyBox) => ({
        ...safetyDepositBoxWithNftMetadataToUserNFT(safetyBox),
        collectionName: safetyBox?.nftCollectionName || '',
      }));
    }
    return [];
  }, [pool]);

  const { control, nfts } = useNFTsFiltering(rawNFTs);

  const { buy, loadingModalVisible, closeLoadingModal, slippage, setSlippage } =
    useNftBuy({ pool, poolTokenInfo });

  const { loading: aprLoading } = useAPR();

  const loading =
    poolLoading || !pool || tokensMapLoading || pricesLoading || aprLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderBuy
          pool={pool}
          onBuy={buy}
          poolTokenInfo={poolTokenInfo}
          poolTokenPrice={
            poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.buy
          }
          slippage={slippage}
          setSlippage={setSlippage}
          hidden={loading}
        />
      }
      tab={POOL_TABS.BUY}
    >
      {loading ? (
        <Loader size="large" />
      ) : (
        <NFTPoolNFTsList
          nfts={nfts}
          setIsSidebar={setIsSidebar}
          control={control}
          sortFieldName={FilterFormInputsNames.SORT}
          sortValues={SORT_VALUES}
          poolName={poolTokenInfo?.name || ''}
        />
      )}
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </NFTPoolPageLayout>
  );
};
