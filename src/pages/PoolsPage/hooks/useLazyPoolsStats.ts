import { useState } from 'react';

import { RAYDIUM_STATS_API } from '../constants';
import { PoolStats, RawPoolStatsV2 } from '../model';

export type PoolsStatsByMarketId = Map<string, PoolStats>;

type FetchPoolsStats = (marketIds: string[]) => Promise<void>;

type UseLazyPoolsStats = () => {
  loading: boolean;
  poolsStatsByMarketId: Map<string, PoolStats>;
  fetchPoolsStats: FetchPoolsStats;
};

export const useLazyPoolsStats: UseLazyPoolsStats = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [poolsStatsByMarketId, setPoolsStatsByMarketId] =
    useState<PoolsStatsByMarketId>(new Map<string, PoolStats>());

  const fetchPoolsStats: FetchPoolsStats = async (marketIds) => {
    try {
      const res: RawPoolStatsV2[] = await (
        await fetch(RAYDIUM_STATS_API)
      ).json();

      const poolsStatsByMarketId: PoolsStatsByMarketId = res
        .filter((poolStats) => marketIds.includes(poolStats.market))
        .reduce((statsByMarketId, poolStats) => {
          statsByMarketId.set(poolStats.market, {
            apr: poolStats.apr7d || 0,
            fee7d: poolStats.fee7d || 0,
            fee24h: poolStats.fee24h || 0,
            liquidity: poolStats.liquidity || 0,
            volume: poolStats.volume30d || 0,
          });

          return statsByMarketId;
        }, new Map<string, PoolStats>());

      setPoolsStatsByMarketId(poolsStatsByMarketId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    poolsStatsByMarketId,
    fetchPoolsStats,
  };
};
