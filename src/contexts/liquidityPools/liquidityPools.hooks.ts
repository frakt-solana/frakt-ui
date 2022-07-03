import { useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3, pools, raydium } from '@frakt-protocol/frakt-sdk';

import { LiquidityPoolsContext } from './liquidityPools.context';
import {
  fetchProgramAccounts,
  fetchRaydiumPoolsInfoMap,
  mapFusionPoolInfo,
  mapRawPools,
} from './liquidityPools.helpers';
import {
  FusionPool,
  FusionPoolInfoByMint,
  LiquidityPoolsContextValues,
  RaydiumPoolInfoMap,
} from './liquidityPools.model';
import { FUSION_PROGRAM_PUBKEY } from './transactions/fusionPools';
import { fetchSolanaPriceUSD } from '../../utils';
import { useConnection } from '../../hooks';

export const useLiquidityPools = (): LiquidityPoolsContextValues => {
  const context = useContext(LiquidityPoolsContext);
  if (context === null) {
    throw new Error('TokenListContext not available');
  }
  return context;
};

export const useCurrentSolanaPrice = (): {
  loading: boolean;
  currentSolanaPriceUSD: number;
  refetch: () => Promise<void>;
} => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSolanaPriceUSD, setCurrentSolanaPriceUSD] = useState<number>(0);

  const fetchSolanaPrice = async (): Promise<void> => {
    try {
      const solanaPrice = await fetchSolanaPriceUSD();

      setCurrentSolanaPriceUSD(solanaPrice);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolanaPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, currentSolanaPriceUSD, refetch: fetchSolanaPrice };
};

export const useLazyRaydiumPoolsInfoMap = (): {
  loading: boolean;
  raydiumPoolsInfoMap: RaydiumPoolInfoMap;
  fetchPoolsInfoMap: (
    poolConfigs: raydium.LiquidityPoolKeysV4[],
  ) => Promise<void>;
} => {
  const connection = useConnection();
  const [loading, setLoading] = useState<boolean>(false);
  const [raydiumPoolsInfoMap, setRaydiumPoolsInfoMap] =
    useState<RaydiumPoolInfoMap>(new Map());

  const fetchPoolsInfoMap = async (
    poolConfigs: raydium.LiquidityPoolKeysV4[],
  ) => {
    try {
      setLoading(true);

      const poolsInfoMap = await fetchRaydiumPoolsInfoMap(
        connection,
        poolConfigs,
      );

      setRaydiumPoolsInfoMap(poolsInfoMap);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { raydiumPoolsInfoMap, loading, fetchPoolsInfoMap };
};

export const useLazyFusionPools_old = (): {
  loading: boolean;
  fusionPoolInfoMap: FusionPoolInfoByMint;
  fetchFusionPoolsInfo: (lpMints: string[]) => Promise<void>;
} => {
  const wallet = useWallet();
  const connection = useConnection();

  const [loading, setLoading] = useState<boolean>(false);
  const [fusionPoolInfoMap, setFusionPoolInfoMap] =
    useState<FusionPoolInfoByMint>(new Map());

  const fetchFusionPoolsInfo = async (lpMints: string[]) => {
    try {
      const allProgramAccounts = await fetchProgramAccounts({
        vaultProgramId: new web3.PublicKey(FUSION_PROGRAM_PUBKEY),
        connection,
      });

      const fusionPoolInfoMap = mapFusionPoolInfo(
        allProgramAccounts,
        lpMints,
        wallet?.publicKey?.toBase58(),
      );

      setFusionPoolInfoMap(fusionPoolInfoMap);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { fusionPoolInfoMap, loading, fetchFusionPoolsInfo };
};

type UseLazyFusionPools = () => {
  fusionPools: FusionPool[];
  loading: boolean;
  initialFetch: () => Promise<void>;
  refetch: () => Promise<void>;
};

export const useLazyFusionPools: UseLazyFusionPools = () => {
  const connection = useConnection();

  const [fusionPools, setFusionPools] = useState<FusionPool[]>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPools = async () => {
    const {
      mainRouters,
      stakeAccounts,
      secondaryRewards,
      secondaryStakeAccounts,
    } = await pools.getAllProgramStakingAccounts(
      new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      connection,
    );

    const fusionPools: FusionPool[] = mapRawPools({
      mainRouters,
      stakeAccounts,
      secondaryRewards,
      secondaryStakeAccounts,
    });
    setFusionPools(fusionPools);
  };

  const initialFetch = async () => {
    try {
      setLoading(true);

      await fetchPools();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    try {
      await fetchPools();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return {
    fusionPools,
    loading,
    initialFetch,
    refetch,
  };
};
