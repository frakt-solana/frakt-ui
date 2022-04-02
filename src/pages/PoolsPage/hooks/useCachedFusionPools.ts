import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';

import {
  fetchProgramAccounts,
  FusionPoolInfo,
  mapFusionPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import { FUSION_PROGRAM_PUBKEY } from '../../../contexts/liquidityPools/transactions/fusionPools';

type FusionPoolsByMint = Map<string, FusionPoolInfo>;

const fusionPoolsByMintCache = { value: new Map<string, FusionPoolInfo>() };

type UseCachedFusionPools = () => {
  fusionPoolsByMint: FusionPoolsByMint;
  loading: boolean;
  fetchFusionPoolsInfo: (lpMints: string[]) => Promise<void>;
};

export const useCachedFusionPools: UseCachedFusionPools = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fusionPoolsByMint, setFusionPoolsByMint] = useState<FusionPoolsByMint>(
    new Map<string, FusionPoolInfo>(),
  );

  const wallet = useWallet();
  const { connection } = useConnection();

  const { poolDataByMint, loading: liquidityPoolsLoading } =
    useLiquidityPools();

  const rawPoolsData = useMemo(() => {
    return poolDataByMint.size
      ? Array.from(poolDataByMint.values()).filter(
          ({ tokenInfo }) => tokenInfo.address !== process.env.FRKT_MINT,
        )
      : [];
  }, [poolDataByMint]);

  const fetchFusionPoolsInfo = async (lpMints: string[]) => {
    const allProgramAccounts = await fetchProgramAccounts({
      vaultProgramId: new PublicKey(FUSION_PROGRAM_PUBKEY),
      connection,
    });

    const fusionPoolsByMint = mapFusionPoolInfo(
      allProgramAccounts,
      lpMints,
      wallet?.publicKey?.toBase58(),
    );

    fusionPoolsByMintCache.value = new Map(fusionPoolsByMint);
    setFusionPoolsByMint(fusionPoolsByMint);
  };

  const initialFetch = async () => {
    try {
      const isDataCached = !!fusionPoolsByMintCache.value.size;

      if (isDataCached) {
        return setFusionPoolsByMint(fusionPoolsByMintCache.value);
      }

      setLoading(true);

      if (rawPoolsData.length) {
        const lpMints = rawPoolsData.map(({ poolConfig }) =>
          poolConfig.lpMint.toBase58(),
        );

        await fetchFusionPoolsInfo(lpMints);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (poolDataByMint.size) {
      initialFetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liquidityPoolsLoading, poolDataByMint]);

  return {
    fusionPoolsByMint,
    loading,
    fetchFusionPoolsInfo,
  };
};
