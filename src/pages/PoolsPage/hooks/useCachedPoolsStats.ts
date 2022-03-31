import { useEffect, useState } from 'react';

import { useLiquidityPools } from '../../../contexts/liquidityPools';
import { RAYDIUM_STATS_API } from '../constants';
import { PoolStats, RawPoolStatsV2 } from '../model';

type PoolsStatsByBaseTokenMint = Map<string, PoolStats>;

const poolsStatsByMarketIdCache = { value: new Map<string, PoolStats>() };

type UseCachedPoolsStats = () => {
  poolsStatsByBaseTokenMint: PoolsStatsByBaseTokenMint;
  loading: boolean;
};

export const useCachedPoolsStats: UseCachedPoolsStats = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [poolsStatsByBaseTokenMint, setPoolsStatsByBaseTokenMint] =
    useState<PoolsStatsByBaseTokenMint>(new Map<string, PoolStats>());

  const { poolDataByMint, loading: liquidityPoolsLoading } =
    useLiquidityPools();

  const fetchPoolsStats = async () => {
    const res: RawPoolStatsV2[] = await (await fetch(RAYDIUM_STATS_API)).json();

    const availableMarkets = Array.from(poolDataByMint.values())?.map(
      ({ poolConfig }) => poolConfig?.marketId?.toBase58(),
    );

    const poolsStatsByBaseTokenMint = res
      .filter((poolStats) => availableMarkets.includes(poolStats.market))
      .reduce((acc, rawStats) => {
        const baseTokenMint = Array.from(poolDataByMint.values())?.find(
          ({ poolConfig }) =>
            poolConfig?.marketId?.toBase58() === rawStats.market,
        )?.tokenInfo?.address;

        if (baseTokenMint) {
          return acc.set(baseTokenMint, {
            apr: rawStats.apr7d || 0,
            fee7d: rawStats.fee7d || 0,
            fee24h: rawStats.fee24h || 0,
            liquidity: rawStats.liquidity || 0,
            volume: rawStats.volume30d || 0,
          });
        }

        return acc;
      }, new Map<string, PoolStats>());

    poolsStatsByMarketIdCache.value = new Map(poolsStatsByBaseTokenMint);
    setPoolsStatsByBaseTokenMint(poolsStatsByBaseTokenMint);
  };

  const initialFetch = async () => {
    try {
      const isDataCached = !!poolsStatsByMarketIdCache.value.size;

      if (isDataCached) {
        return setPoolsStatsByBaseTokenMint(poolsStatsByMarketIdCache.value);
      }

      setLoading(true);
      await fetchPoolsStats();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (poolDataByMint.size) {
      initialFetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityPoolsLoading, poolDataByMint]);

  return {
    poolsStatsByBaseTokenMint,
    loading,
  };
};
