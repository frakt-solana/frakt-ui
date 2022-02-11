import { WSOL } from '@raydium-io/raydium-sdk';
import { useState } from 'react';

import {
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';

export const useLazyPoolInfo = (): {
  poolInfo: RaydiumPoolInfo | null;
  fetchPoolInfo: (
    payTokenMint: string,
    receiveTokenMint: string,
  ) => Promise<void>;
  loading: boolean;
} => {
  const { fetchRaydiumPoolsInfo, poolDataByMint } = useLiquidityPools();
  const [poolInfo, setPoolInfo] = useState<RaydiumPoolInfo>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (
    payTokenMint: string,
    receiveTokenMint: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      //? Token mint (not SOL)
      const tokenMint =
        payTokenMint === WSOL.mint ? receiveTokenMint : payTokenMint;

      const poolData = poolDataByMint.get(tokenMint);

      const info = (await fetchRaydiumPoolsInfo([poolData.poolConfig]))[0];

      setPoolInfo(info);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      notify({
        message: 'Error fetching pool info',
        type: NotifyType.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    poolInfo,
    fetchPoolInfo: fetch,
    loading,
  };
};
