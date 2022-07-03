import { useMemo } from 'react';
import { raydium } from '@frakt-protocol/frakt-sdk';

import { useLiquidityPools } from '../../../../contexts/liquidityPools';

type UseRaydiumLiquidityPoolKeys = (poolTokenMint: string) => {
  loading: boolean;
  liquidityPoolKeys: raydium.LiquidityPoolKeysV4;
};

export const useRaydiumLiquidityPoolKeys: UseRaydiumLiquidityPoolKeys = (
  poolTokenMint,
) => {
  const {
    poolDataByMint: liquidityPoolDataByMint,
    loading: liquidityPoolDataByMintLoading,
  } = useLiquidityPools();

  const liquidityPoolKeys = useMemo(() => {
    if (
      liquidityPoolDataByMint?.size &&
      !liquidityPoolDataByMintLoading &&
      poolTokenMint
    ) {
      return liquidityPoolDataByMint.get(poolTokenMint)?.poolConfig;
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    liquidityPoolDataByMint?.size,
    liquidityPoolDataByMintLoading,
    poolTokenMint,
  ]);

  return {
    loading: liquidityPoolDataByMintLoading,
    liquidityPoolKeys,
  };
};
