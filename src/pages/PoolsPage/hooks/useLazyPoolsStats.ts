import { useState } from 'react';

const RAYDIUM_STATS_API = 'https://api.raydium.io/pairs';

interface RawPoolStats {
  amm_id: string;
  apy: number;
  fee_7d: number;
  fee_7d_quote: number;
  fee_24h: number;
  fee_24h_quote: number;
  liquidity: number;
  lp_mint: string;
  lp_price: number;
  market: string;
  name: string;
  official: boolean;
  pair_id: string;
  price: number;
  token_amount_coin: number;
  token_amount_lp: number;
  token_amount_pc: number;
  volume_7d: number;
  volume_7d_quote: number;
  volume_24h: number;
  volume_24h_quote: number;
}

export interface PoolStats {
  apy: number;
  fee7d: number;
  fee24h: number;
  liquidity: number;
}

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
      const res: RawPoolStats[] = await (await fetch(RAYDIUM_STATS_API)).json();

      const poolsStatsByMarketId: PoolsStatsByMarketId = res
        .filter((poolStats) => marketIds.includes(poolStats.market))
        .reduce((statsByMarketId, poolStats) => {
          statsByMarketId.set(poolStats.market, {
            apy: poolStats.apy || 0,
            fee7d: poolStats.fee_7d || 0,
            fee24h: poolStats.fee_24h || 0,
            liquidity: poolStats.liquidity || 0,
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
