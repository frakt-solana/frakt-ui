import { PoolStats, useCachedPoolsStats } from '../../../PoolsPage';

type UseCachedSpecificPoolStats = (tokenMint: string) => {
  loading: boolean;
  poolStats: PoolStats | null;
};

export const useCachedSpecificPoolStats: UseCachedSpecificPoolStats = (
  tokenMint?: string,
) => {
  const { poolsStatsByBaseTokenMint, loading } = useCachedPoolsStats();

  return {
    loading,
    poolStats: poolsStatsByBaseTokenMint.get(tokenMint) || null,
  };
};
