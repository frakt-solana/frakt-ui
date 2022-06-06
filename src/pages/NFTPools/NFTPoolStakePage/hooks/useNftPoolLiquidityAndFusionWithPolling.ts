import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { useEffect, useMemo, useState } from 'react';

import {
  findSpecificFusionPool,
  FusionPool,
  RaydiumPoolInfo,
  useLazyFusionPools,
  useLiquidityPools,
} from '../../../../contexts/liquidityPools';
import { usePolling } from '../../../../hooks';
import { useRaydiumLiquidityPoolKeys } from './useRaydiumLiquidityPoolKeys';

type UseNftPoolLiquidityAndFusionWithPolling = (poolTokenMint: string) => {
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  inventoryFusionPool: FusionPool;
  liquidityFusionPool: FusionPool;
  loading: boolean;
};

export const useNftPoolLiquidityAndFusionWithPolling: UseNftPoolLiquidityAndFusionWithPolling =
  (poolTokenMint) => {
    const { liquidityPoolKeys, loading: liquidityPoolKeysLoading } =
      useRaydiumLiquidityPoolKeys(poolTokenMint);

    const { fetchRaydiumPoolsInfo } = useLiquidityPools();
    const [raydiumPoolInfo, setRaydiumPoolInfo] =
      useState<RaydiumPoolInfo>(null);
    const [raydiumPoolInfoLoading, setRaydiumPoolInfoLoading] =
      useState<boolean>(false);

    const raydiumPoolInfoFetch = async (
      liquidityPoolKeys: LiquidityPoolKeysV4,
    ) => {
      const result = await fetchRaydiumPoolsInfo([liquidityPoolKeys]);

      return result?.[0] || null;
    };

    const raydiumPoolInitialFetch = async () => {
      try {
        setRaydiumPoolInfoLoading(true);
        const raydiumPoolInfo = await raydiumPoolInfoFetch(liquidityPoolKeys);
        setRaydiumPoolInfo(raydiumPoolInfo);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      } finally {
        setRaydiumPoolInfoLoading(false);
      }
    };

    const raydiumPoolRefetch = async () => {
      try {
        const raydiumPoolInfo = await raydiumPoolInfoFetch(liquidityPoolKeys);
        setRaydiumPoolInfo(raydiumPoolInfo);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    const {
      fusionPools,
      loading: fusionPoolsLoading,
      initialFetch: fusionPoolsInitialFetch,
      refetch: fusionPoolsRefetch,
    } = useLazyFusionPools();

    useEffect(() => {
      if (liquidityPoolKeys && poolTokenMint) {
        Promise.all([fusionPoolsInitialFetch(), raydiumPoolInitialFetch()]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liquidityPoolKeys, poolTokenMint]);

    const inventoryFusionPool = useMemo(() => {
      if (fusionPools?.length && !fusionPoolsLoading && poolTokenMint) {
        return findSpecificFusionPool(
          fusionPools,
          poolTokenMint,
          poolTokenMint,
        );
      }

      return null;
    }, [fusionPools, fusionPoolsLoading, poolTokenMint]);

    const liquidityFusionPool = useMemo(() => {
      if (
        fusionPools?.length &&
        !fusionPoolsLoading &&
        poolTokenMint &&
        liquidityPoolKeys
      ) {
        return findSpecificFusionPool(
          fusionPools,
          liquidityPoolKeys?.lpMint?.toBase58(),
          poolTokenMint,
        );
      }

      return null;
    }, [fusionPools, fusionPoolsLoading, poolTokenMint, liquidityPoolKeys]);

    const poll = async (): Promise<void> => {
      await Promise.all([raydiumPoolRefetch(), fusionPoolsRefetch()]);
    };

    const { isPolling, startPolling, stopPolling } = usePolling(poll, 10_000);

    useEffect(() => {
      if (
        !fusionPoolsLoading &&
        !raydiumPoolInfoLoading &&
        !liquidityPoolKeysLoading &&
        liquidityPoolKeys &&
        !isPolling
      ) {
        startPolling();
      } else {
        stopPolling();
      }
      return () => stopPolling();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      liquidityPoolKeys,
      fusionPoolsLoading,
      raydiumPoolInfoLoading,
      liquidityPoolKeysLoading,
    ]);

    return {
      raydiumLiquidityPoolKeys: liquidityPoolKeys,
      raydiumPoolInfo,
      inventoryFusionPool,
      liquidityFusionPool,
      loading:
        liquidityPoolKeysLoading ||
        fusionPoolsLoading ||
        raydiumPoolInfoLoading,
    };
  };
