import { useEffect } from 'react';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  FusionPoolInfoByMint,
  useLazyFusionPools,
} from '../../../contexts/liquidityPools';
import { usePolling } from '../../../hooks';
import { POOL_INFO_POLLING_INTERVAL } from '../constants';

type UsePollPoolCard = (
  poolConfig: LiquidityPoolKeysV4,
  isOpen: boolean,
) => { fusionPoolInfoMap: FusionPoolInfoByMint };

export const usePollPoolCard: UsePollPoolCard = (
  poolConfig: LiquidityPoolKeysV4,
  isOpen: boolean,
) => {
  const { fetchFusionPoolsInfo, fusionPoolInfoMap } = useLazyFusionPools();
  const { connected } = useWallet();

  const poll = async (): Promise<void> => {
    await fetchFusionPoolsInfo([poolConfig.lpMint.toBase58()]);
  };

  const { isPolling, startPolling, stopPolling } = usePolling(
    poll,
    POOL_INFO_POLLING_INTERVAL,
  );

  useEffect(() => {
    if (isOpen && !isPolling && connected) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, connected]);

  return { fusionPoolInfoMap };
};
