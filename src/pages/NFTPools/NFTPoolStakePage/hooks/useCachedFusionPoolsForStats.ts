import { getAllProgramAccounts } from '@frakters/frkt-multiple-reward';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

import { FusionPool, mapRawPools } from '../../../../contexts/liquidityPools';
import { useConnection } from '../../../../hooks';

const fusionPoolsCache = { value: null };

type UseCachedFusionPoolsForStats = () => {
  fusionPools: FusionPool[];
  loading: boolean;
  fetchPools: () => Promise<void>;
};

export const useCachedFusionPoolsForStats: UseCachedFusionPoolsForStats =
  () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [fusionPools, setFusionPools] = useState<FusionPool[]>(null);

    const connection = useConnection();

    const fetchPools = async () => {
      const {
        mainRouters,
        stakeAccounts,
        secondaryRewards,
        secondaryStakeAccounts,
      } = await getAllProgramAccounts(
        new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        connection,
      );

      const fusionPools: FusionPool[] = mapRawPools({
        mainRouters,
        stakeAccounts,
        secondaryRewards,
        secondaryStakeAccounts,
      });

      fusionPoolsCache.value = fusionPools;
      setFusionPools(fusionPools);
    };

    const initialFetch = async () => {
      try {
        const isDataCached = !!fusionPoolsCache?.value?.length;

        if (isDataCached) {
          return setFusionPools(fusionPoolsCache?.value);
        }

        setLoading(true);

        await fetchPools();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (!fusionPools) {
        initialFetch();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
      fusionPools,
      loading,
      fetchPools,
    };
  };
