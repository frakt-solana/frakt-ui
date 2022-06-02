import { PoolStats } from '../../model';
import { useCachedPoolsStats } from './useCachedPoolsStats';

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
