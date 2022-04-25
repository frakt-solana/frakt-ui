import { NftPoolData } from '../../utils/cacher/nftPools/nftPools.model';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { TokenInfo } from '@solana/spl-token-registry';
import { Percent } from '@raydium-io/raydium-sdk';

import {
  UserNFT,
  UserNFTWithCollection,
  useUserTokens,
} from '../../contexts/userTokens';
import { useDebounce } from '../../hooks';
import { useUserSplAccount } from '../../utils/accounts';
import { SORT_VALUES } from './components/NFTPoolNFTsList';
import { LOTTERY_TICKET_ACCOUNT_LAYOUT } from './constants';
import { FilterFormFieldsValues, FilterFormInputsNames } from './model';
import {
  FusionPool,
  getFusionApr,
  PoolDataByMint,
  useLiquidityPools,
} from '../../contexts/liquidityPools';
import { getInputAmount, getOutputAmount } from '../../components/SwapForm';
import { SOL_TOKEN, swapStringKeysAndValues } from '../../utils';
import { PoolStats, useCachedPoolsStats } from '../PoolsPage';
import { useParams } from 'react-router-dom';
import { CUSTOM_POOLS_NAMES } from '../../utils/cacher/nftPools';
import { useCachedFusionPoolsForStats } from './NFTPoolStakePage/hooks';

type UseNFTsFiltering = (nfts: UserNFTWithCollection[]) => {
  control: Control<FilterFormFieldsValues>;
  nfts: UserNFTWithCollection[];
  setSearch: (value?: string) => void;
};

export const useNFTsFiltering: UseNFTsFiltering = (nfts) => {
  const { control, watch } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: SORT_VALUES[0],
    },
  });

  const [searchString, setSearchString] = useState<string>('');

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const sort = watch(FilterFormInputsNames.SORT);

  const filteredNfts = useMemo(() => {
    if (nfts.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return nfts
        .filter((nft) => {
          const nftName = nft?.metadata?.name?.toUpperCase() || '';

          return nftName.includes(searchString);
        })
        .sort((nftA, nftB) => {
          if (sortField === 'name') {
            if (sortOrder === 'asc')
              return nftA?.metadata?.name?.localeCompare(nftB?.metadata?.name);
            return nftB?.metadata?.name?.localeCompare(nftA?.metadata?.name);
          }
          return 0;
        });
    }

    return [];
  }, [nfts, sort, searchString]);

  return { control, nfts: filteredNfts, setSearch: searchDebounced };
};

type SubscribeOnLotteryTicketChanges = (
  lotteryTicketPublicKey: PublicKey,
  callback: (value: string) => void,
) => void;

type UseLotteryTicketSubscription = () => {
  subscribe: SubscribeOnLotteryTicketChanges;
  unsubscribe: () => void;
};

export const useLotteryTicketSubscription: UseLotteryTicketSubscription =
  () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const subscriptionId = useRef<number>();

    const subscribe: SubscribeOnLotteryTicketChanges = (
      lotteryTicketPublicKey,
      callback,
    ) => {
      subscriptionId.current = connection.onAccountChange(
        lotteryTicketPublicKey,
        (lotteryTicketAccountEncoded) => {
          const account = LOTTERY_TICKET_ACCOUNT_LAYOUT.decode(
            lotteryTicketAccountEncoded.data,
          );

          callback(account.winning_safety_box.toBase58());
        },
      );
    };

    const unsubscribe = () => {
      if (subscriptionId.current) {
        connection.removeAccountChangeListener(subscriptionId.current);
        subscriptionId.current = null;
      }
    };

    useEffect(() => {
      return () => unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection, wallet]);

    return {
      subscribe,
      unsubscribe,
    };
  };

const POOL_TOKEN_DECIMALS = 9;

export const useNftPoolTokenBalance = (
  pool: NftPoolData,
): {
  balance: number;
} => {
  const { connected } = useWallet();

  const { accountInfo, subscribe: splTokenSubscribe } = useUserSplAccount();

  useEffect(() => {
    connected && splTokenSubscribe(pool?.fractionMint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const balance = accountInfo
    ? accountInfo?.accountInfo?.amount?.toNumber() / 10 ** POOL_TOKEN_DECIMALS
    : 0;

  return {
    balance,
  };
};

export interface Price {
  buy: string;
  sell: string;
}

export type PricesByTokenMint = Map<string, Price>;

type UsePoolTokensPrices = (poolTokensInfo: TokenInfo[]) => {
  loading: boolean;
  pricesByTokenMint: PricesByTokenMint;
  poolDataByMint: PoolDataByMint;
};

const pricesByTokenMintCache = { value: new Map<string, Price>() };

export const usePoolTokensPrices: UsePoolTokensPrices = (
  poolTokensInfo = [],
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pricesByTokenMint, setPricesByTokenMint] = useState<PricesByTokenMint>(
    new Map<string, Price>(),
  );

  const {
    poolDataByMint,
    loading: liquidityPoolsLoading,
    fetchRaydiumPoolsInfo,
  } = useLiquidityPools();

  const fetchPrices = async () => {
    const poolsData = poolTokensInfo
      .map((poolTokenInfo) => poolDataByMint.get(poolTokenInfo?.address))
      .filter((poolData) => !!poolData);

    if (poolsData.length) {
      const poolConfigs = poolsData.map(({ poolConfig }) => poolConfig);

      const poolsInfo = await fetchRaydiumPoolsInfo(poolConfigs);

      const pricesByTokenMint = poolsInfo.reduce((map, poolInfo, idx) => {
        const { amountOut: sellPrice } = getOutputAmount({
          poolKeys: poolConfigs?.[idx],
          poolInfo,
          payToken: poolTokensInfo?.[idx],
          payAmount: 1,
          receiveToken: SOL_TOKEN,
          slippage: new Percent(1, 100),
        });

        const { amountIn: buyPrice } = getInputAmount({
          poolKeys: poolConfigs?.[idx],
          poolInfo,
          payToken: SOL_TOKEN,
          receiveAmount: 1,
          receiveToken: poolTokensInfo?.[idx],
          slippage: new Percent(1, 100),
        });

        return map.set(poolTokensInfo?.[idx]?.address, {
          buy: buyPrice,
          sell: sellPrice,
        });
      }, new Map<string, Price>());

      pricesByTokenMintCache.value = new Map(pricesByTokenMint);

      setPricesByTokenMint(pricesByTokenMint);
    }
  };

  const initialFetch = async () => {
    try {
      const isDataCached =
        poolTokensInfo.filter((tokenInfo) => {
          return !!pricesByTokenMintCache.value?.has(tokenInfo?.address);
        }).length === poolTokensInfo.length && poolTokensInfo.length !== 0;

      if (isDataCached) {
        return setPricesByTokenMint(pricesByTokenMintCache.value);
      }

      setLoading(true);
      await fetchPrices();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      poolDataByMint.size &&
      poolTokensInfo.length &&
      !liquidityPoolsLoading
    ) {
      initialFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityPoolsLoading, poolDataByMint?.size, poolTokensInfo?.length]);

  return {
    loading: loading || liquidityPoolsLoading,
    pricesByTokenMint,
    poolDataByMint,
  };
};

type UseUserRawNfts = () => {
  rawNfts: UserNFT[];
  rawNftsLoading: boolean;
  removeTokenOptimistic: (mints: string[]) => void;
};

export const useUserRawNfts: UseUserRawNfts = () => {
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

  return {
    rawNfts,
    rawNftsLoading: userTokensLoading || nftsLoading,
    removeTokenOptimistic,
  };
};

type UseAPR = (poolTokenInfo?: TokenInfo) => {
  loading: boolean;
  liquidityAPR: number;
  inventoryAPR: number;
  raydiumPoolLiquidityUSD: number;
};

export const useAPR: UseAPR = (poolTokenInfo) => {
  const { fusionPools, loading: fusionPoolsLoading } =
    useCachedFusionPoolsForStats();

  const { poolDataByMint, loading: liquidityPoolsLoading } =
    useLiquidityPools();

  const { poolsStatsByBaseTokenMint, loading: poolsStatsLoading } =
    useCachedPoolsStats();

  const liquidityFusionPoolInfo = useMemo(() => {
    if (poolDataByMint?.size && poolTokenInfo?.address && fusionPools?.length) {
      const poolData = poolDataByMint.get(poolTokenInfo?.address);
      const lpMint = poolData?.poolConfig?.lpMint.toBase58();

      const liquidityFusionPool =
        fusionPools?.find(({ router }) => {
          return (
            router.tokenMintInput === lpMint &&
            router.tokenMintOutput === poolTokenInfo?.address
          );
        }) || null;

      return liquidityFusionPool;
    }

    return null;
  }, [poolDataByMint, poolTokenInfo?.address, fusionPools]);

  const inventoryFusionPoolInfo = useMemo(() => {
    if (poolTokenInfo?.address && fusionPools?.length) {
      const inventoryFusionPool =
        fusionPools?.find(({ router }) => {
          return (
            router.tokenMintInput === poolTokenInfo?.address &&
            router.tokenMintOutput === poolTokenInfo?.address
          );
        }) || null;

      return inventoryFusionPool;
    }

    return null;
  }, [poolTokenInfo?.address, fusionPools]);

  const poolStats = poolsStatsByBaseTokenMint.get(poolTokenInfo?.address);

  const loading =
    fusionPoolsLoading || liquidityPoolsLoading || poolsStatsLoading;

  return {
    loading,
    liquidityAPR:
      sumFusionAndRaydiumApr(liquidityFusionPoolInfo, poolStats) || 0,
    inventoryAPR: getFusionApr(inventoryFusionPoolInfo?.router) || 0,
    raydiumPoolLiquidityUSD: poolStats?.liquidity || 0,
  };
};

export const sumFusionAndRaydiumApr = (
  fusionPool: FusionPool,
  poolStats: PoolStats,
): number => {
  if (fusionPool?.router) {
    return getFusionApr(fusionPool.router) + poolStats?.apr;
  }
  return poolStats?.apr || 0;
};

type UsePoolPubkeyParam = () => string;

export const usePoolPubkeyParam: UsePoolPubkeyParam = () => {
  const { poolPubkey: poolPubkeyOrName } = useParams<{ poolPubkey: string }>();

  return (
    swapStringKeysAndValues(CUSTOM_POOLS_NAMES)[poolPubkeyOrName] ||
    poolPubkeyOrName
  );
};
