import { useState } from 'react';

const RAYDIUM_STATS_API = 'https://api.raydium.io/v2/main/pairs';

// interface RawPoolStatsV1 {
//   amm_id: string;
//   apy: number;
//   fee_7d: number;
//   fee_7d_quote: number;
//   fee_24h: number;
//   fee_24h_quote: number;
//   liquidity: number;
//   lp_mint: string;
//   lp_price: number;
//   market: string;
//   name: string;
//   official: boolean;
//   pair_id: string;
//   price: number;
//   token_amount_coin: number;
//   token_amount_lp: number;
//   token_amount_pc: number;
//   volume_7d: number;
//   volume_7d_quote: number;
//   volume_24h: number;
//   volume_24h_quote: number;
// }

interface RawPoolStatsV2 {
  amm_id: string;
  apr7d: number;
  apr24h: number;
  apr30d: number;
  fee7d: number;
  fee7dQuote: number;
  fee24h: number;
  fee24hQuote: number;
  fee30d: number;
  fee30dQuote: number;
  liquidity: number;
  lpMint: string;
  lpPrice: number;
  market: string;
  name: string;
  price: number;
  tokenAmountCoin: number;
  tokenAmountLp: number;
  tokenAmountPc: number;
  volume7d: number;
  volume7dQuote: number;
  volume24h: number;
  volume24hQuote: number;
  volume30d: number;
  volume30dQuote: number;
}

export interface PoolStats {
  apr: number;
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
      const res: RawPoolStatsV2[] = await (
        await fetch(RAYDIUM_STATS_API)
      ).json();

      const poolsStatsByMarketId: PoolsStatsByMarketId = res
        .filter((poolStats) => marketIds.includes(poolStats.market))
        .reduce((statsByMarketId, poolStats) => {
          statsByMarketId.set(poolStats.market, {
            apr: poolStats.apr30d || 0,
            fee7d: poolStats.fee7d || 0,
            fee24h: poolStats.fee24h || 0,
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
