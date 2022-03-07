import { useContext, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

import { LiquidityPoolsContext } from './liquidityPools.context';
import {
  fetchFusionPoolInfo,
  fetchProgramAccounts,
  fetchRaydiumPoolsInfoMap,
  fetchSolanaPriceUSD,
} from './liquidityPools.helpers';
import {
  FusionPoolInfoByMint,
  LiquidityPoolsContextValues,
  RaydiumPoolInfoMap,
} from './liquidityPools.model';
import { FUSION_PROGRAM_PUBKEY } from './transactions/fusionPools';

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
  fetchPoolsInfoMap: (poolConfigs: LiquidityPoolKeysV4[]) => Promise<void>;
} => {
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(false);
  const [raydiumPoolsInfoMap, setRaydiumPoolsInfoMap] =
    useState<RaydiumPoolInfoMap>(new Map());

  const fetchPoolsInfoMap = async (poolConfigs: LiquidityPoolKeysV4[]) => {
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

export const useLazyFusionPools = (): {
  loading: boolean;
  fusionPoolInfoMap: FusionPoolInfoByMint;
  fetchFusionPoolsInfo: (lpMints: string[]) => Promise<void>;
} => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading] = useState<boolean>(true);
  const [fusionPoolInfoMap, setFusionPoolInfoMap] =
    useState<FusionPoolInfoByMint>(new Map());

  const fetchFusionPoolsInfo = async (lpMints: string[]) => {
    try {
      const allProgramAccounts = await fetchProgramAccounts({
        vaultProgramId: new PublicKey(FUSION_PROGRAM_PUBKEY),
        connection,
      });

      console.log(allProgramAccounts);

      const fusionPoolInfoMap = fetchFusionPoolInfo(
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
