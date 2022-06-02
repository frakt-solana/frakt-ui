import { useContext, useEffect, useMemo } from 'react';
import { pools as nftPools } from '@frakt-protocol/frakt-sdk';

import { NftPoolsContext } from './nftPools.context';

import { NftPoolsContextValues, UseNftPool } from './nftPools.model';

export const useNftPools = (): NftPoolsContextValues => {
  const context = useContext(NftPoolsContext);

  return context;
};

export const useNftPoolsInitialFetch = (): void => {
  const { loading, pools, initialFetch } = useNftPools();

  useEffect(() => {
    if (!loading && !pools.length) {
      initialFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useNftPoolsPolling = (): void => {
  const { isPolling, startPolling, stopPolling } = useNftPools();

  useEffect(() => {
    !isPolling && startPolling();

    return () => {
      isPolling && stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling]);
};

export const useNftPool: UseNftPool = (poolPubkey) => {
  const { pools, loading } = useNftPools();

  const pool = useMemo(() => {
    if (pools.length && poolPubkey) {
      return pools.find(({ publicKey }) => publicKey.toBase58() === poolPubkey);
    }

    return null;
  }, [pools, poolPubkey]);

  const whitelistedMintsDictionary = useMemo(() => {
    if (pool) {
      return nftPools.getWhitelistedMintsDictionary(pool);
    }
    return {};
  }, [pool]);

  const whitelistedCreatorsDictionary = useMemo(() => {
    if (pool) {
      return nftPools.getWhitelistedCreatorsDictionary(pool);
    }
    return {};
  }, [pool]);

  return {
    pool,
    loading,
    whitelistedMintsDictionary,
    whitelistedCreatorsDictionary,
  };
};
