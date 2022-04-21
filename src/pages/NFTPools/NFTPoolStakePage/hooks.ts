import { useEffect, useMemo } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { findSpecificFusionPool } from './../../../contexts/liquidityPools/liquidityPools.helpers';
import {
  FusionPool,
  RaydiumPoolInfo,
  useLazyFusionPools,
  useLazyRaydiumPoolsInfoMap,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import { filterWhitelistedNFTs, useNftPool } from '../../../contexts/nftPools';
import { useTokenListContext } from '../../../contexts/TokenList';
import { UserNFT } from '../../../contexts/userTokens';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import { PoolStats, useCachedPoolsStats } from '../../PoolsPage';
import { useAPR, useUserRawNfts } from '../hooks';

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

const useLiquidityPool = (poolTokenMint: string) => {
  const {
    poolDataByMint: liquidityPoolDataByMint,
    loading: liquidityPoolDataByMintLoading,
  } = useLiquidityPools();
  const {
    loading: poolsInfoMapLoading,
    raydiumPoolsInfoMap,
    fetchPoolsInfoMap,
  } = useLazyRaydiumPoolsInfoMap();

  const liquidityPoolData = useMemo(() => {
    if (
      liquidityPoolDataByMint?.size &&
      !liquidityPoolDataByMintLoading &&
      poolTokenMint
    ) {
      return liquidityPoolDataByMint.get(poolTokenMint);
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    liquidityPoolDataByMint?.size,
    liquidityPoolDataByMintLoading,
    poolTokenMint,
  ]);

  useEffect(() => {
    if (liquidityPoolData) {
      fetchPoolsInfoMap([liquidityPoolData?.poolConfig]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityPoolData]);

  return {
    loading: poolsInfoMapLoading || liquidityPoolDataByMintLoading,
    liquidityPoolData,
    liquidityPoolInfo: raydiumPoolsInfoMap?.get(poolTokenMint) || null,
  };
};

type UseNftPoolForStakePage = (poolPubkey: string) => {
  pool: NftPoolData;
  poolStats: PoolStats;
  poolTokenInfo: TokenInfo;
  walletNfts: UserNFT[];
  liquidityAPR: number;
  pageLoading: boolean;
  loading: boolean;
  inventoryFusionPool: FusionPool | null;
  liquidityFusionPool: FusionPool | null;
  liquidityPoolInfo: RaydiumPoolInfo | null;
};

export const useNftPoolForStakePage: UseNftPoolForStakePage = (
  poolPubkey: string,
) => {
  const {
    pool,
    whitelistedMintsDictionary,
    whitelistedCreatorsDictionary,
    loading: poolLoading,
  } = useNftPool(poolPubkey);

  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolPublicKey = pool?.publicKey?.toBase58();
  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const { rawNfts, rawNftsLoading } = useUserRawNfts();

  const whitelistedNFTs = useMemo(() => {
    return filterWhitelistedNFTs(
      rawNfts || [],
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    );
  }, [rawNfts, whitelistedMintsDictionary, whitelistedCreatorsDictionary]);

  const { loading: aprLoading, liquidityAPR } = useAPR(poolTokenInfo);

  const { poolStats, loading: poolsStatsLoading } = useCachedSpecificPoolStats(
    poolTokenInfo?.address,
  );

  const {
    fusionPools,
    loading: fusionPoolsLoading,
    initialFetch,
  } = useLazyFusionPools();

  useEffect(() => {
    initialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inventoryFusionPool = useMemo(() => {
    if (fusionPools?.length && !fusionPoolsLoading && poolTokenInfo?.address) {
      return findSpecificFusionPool(
        fusionPools,
        poolTokenInfo.address,
        poolTokenInfo.address,
      );
    }

    return null;
  }, [fusionPools, fusionPoolsLoading, poolTokenInfo?.address]);

  const {
    liquidityPoolInfo,
    liquidityPoolData,
    loading: liquidityPoolInfoLoading,
  } = useLiquidityPool(poolTokenInfo?.address);

  const liquidityFusionPool = useMemo(() => {
    if (
      fusionPools?.length &&
      !fusionPoolsLoading &&
      poolTokenInfo?.address &&
      liquidityPoolData
    ) {
      return findSpecificFusionPool(
        fusionPools,
        liquidityPoolData?.poolConfig?.lpMint?.toBase58(),
        poolTokenInfo.address,
      );
    }

    return null;
  }, [
    fusionPools,
    fusionPoolsLoading,
    poolTokenInfo?.address,
    liquidityPoolData,
  ]);

  const loading =
    rawNftsLoading ||
    poolLoading ||
    tokensMapLoading ||
    aprLoading ||
    poolsStatsLoading ||
    liquidityPoolInfoLoading ||
    fusionPoolsLoading;

  return {
    pool,
    poolStats,
    poolTokenInfo,
    walletNfts: whitelistedNFTs,
    liquidityAPR,
    loading,
    pageLoading: poolLoading || aprLoading || poolsStatsLoading,
    inventoryFusionPool,
    liquidityFusionPool,
    liquidityPoolInfo,
  };
};
