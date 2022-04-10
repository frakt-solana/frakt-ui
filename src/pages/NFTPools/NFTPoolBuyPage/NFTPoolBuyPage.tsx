import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import BN from 'bn.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';

import { HeaderBuy } from './components/HeaderBuy';
import { usePublicKeyParam } from '../../../hooks';
import {
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../../contexts/nftPools';
import { Loader } from '../../../components/Loader';
import { UserNFTWithCollection } from '../../../contexts/userTokens';
import { safetyDepositBoxWithNftMetadataToUserNFT } from '../../../utils/cacher/nftPools/nftPools.helpers';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { useAPR, useNFTsFiltering, usePoolTokensPrices } from '../hooks';
import { FilterFormInputsNames } from '../model';
import {
  NFTPoolPageLayout,
  PoolPageType,
} from '../components/NFTPoolPageLayout';
import { useTokenListContext } from '../../../contexts/TokenList';
import { useLiquidityPools } from '../../../contexts/liquidityPools';

import { NftPoolData } from '../../../utils/cacher/nftPools';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../components/LoadingModal';
import { getTokenPrice } from '../helpers';
import { SOL_TOKEN } from '../../../utils';

// const getNftImagesForLottery = (
//   nfts: UserNFTWithCollection[],
// ): string[] => {
//   const ARRAY_SIZE = 20;

//   const shuffled = shuffle(nfts.map(({ metadata }) => metadata.image));

//   if (shuffled.length >= ARRAY_SIZE) {
//     return shuffled.slice(0, ARRAY_SIZE);
//   }

//   return shuffled;
// };

const useNftBuy = ({
  pool,
  poolTokenInfo,
}: {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
}) => {
  const { poolDataByMint, raydiumSwap } = useLiquidityPools();
  const { connection } = useConnection();
  const { getLotteryTicket } = useNftPools();
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const [slippage, setSlippage] = useState<number>(0.5);
  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);

  const buyPoolToken = async (): Promise<boolean> => {
    const poolData = poolDataByMint.get(poolTokenInfo.address);

    const { amountWithSlippage: payAmount } = await getTokenPrice({
      poolData,
      slippage: slippage || 1,
      isBuy: true,
      connection,
    });

    const payAmountBN = new BN(
      parseFloat(payAmount) * 10 ** poolTokenInfo.decimals,
    );

    const receiveAmountBN = new BN(10 ** SOL_TOKEN?.decimals);

    const success = await raydiumSwap({
      quoteToken: poolTokenInfo,
      quoteAmount: receiveAmountBN,
      baseToken: SOL_TOKEN,
      baseAmount: payAmountBN,
      poolConfig: poolData?.poolConfig,
    });

    return !!success;
  };

  const runLottery = async (): Promise<boolean> => {
    const poolData = poolDataByMint.get(poolTokenInfo.address);
    const poolLpMint = poolData?.poolConfig?.lpMint;

    const success = await getLotteryTicket({
      pool,
      poolLpMint,
    });

    return !!success;
  };

  const buy = async (needSwap = false) => {
    try {
      openLoadingModal();

      if (needSwap) {
        setTransactionsLeft(2);
        const isTokenBuySucessful = await buyPoolToken();
        if (!isTokenBuySucessful) {
          throw new Error('Raydium swap failed');
        }
      }

      setTransactionsLeft(1);
      const isLotterySuccessful = await runLottery();
      if (!isLotterySuccessful) {
        throw new Error('Lottery failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
      setTransactionsLeft(null);
    }
  };

  return {
    buy,
    loadingModalVisible,
    closeLoadingModal,
    loadingModalSubtitle: `Time gap between transactions can be up to 1 minute.\nTransactions left: ${transactionsLeft}`,
    slippage,
    setSlippage,
  };
};

export const NFTPoolBuyPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
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

  const {
    buy,
    loadingModalVisible,
    closeLoadingModal,
    loadingModalSubtitle,
    slippage,
    setSlippage,
  } = useNftBuy({ pool, poolTokenInfo });

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
      pageType={PoolPageType.BUY}
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
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle={loadingModalSubtitle}
      />
    </NFTPoolPageLayout>
  );
};
