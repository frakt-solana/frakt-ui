import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { useEffect, useState } from 'react';
import {
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../contexts/liquidityPools';
import { fetchSolanaPriceUSD } from './liquidityPools.helper';

export const useCurrentSolanaPrice = (): {
  currentSolanaPriceUSD: number;
  refetch: () => Promise<void>;
} => {
  const [currentSolanaPriceUSD, setCurrentSolanaPriceUSD] = useState<number>();

  useEffect(() => {
    fetchSolanaPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSolanaPrice = async (): Promise<void> => {
    try {
      const solanaPrice = await fetchSolanaPriceUSD();

      setCurrentSolanaPriceUSD(solanaPrice);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return { currentSolanaPriceUSD, refetch: fetchSolanaPrice };
};

export const useRaydiumPoolsInfo = (
  poolConfig: LiquidityPoolKeysV4[],
  loading: boolean,
): {
  raydiumPoolInfo: RaydiumPoolInfo[];
} => {
  const [raydiumPoolInfo, setRaydiumPoolInfo] = useState<RaydiumPoolInfo[]>([]);
  const { fetchRaydiumPoolsInfo } = useLiquidityPools();

  useEffect(() => {
    !loading && fetchRaydiumData(poolConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const fetchRaydiumData = async (
    poolConfig: LiquidityPoolKeysV4[],
  ): Promise<void> => {
    try {
      const poolInfo = await fetchRaydiumPoolsInfo(poolConfig);

      setRaydiumPoolInfo(poolInfo);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return { raydiumPoolInfo };
};
