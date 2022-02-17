import { useContext, useEffect, useMemo } from 'react';

import { PoolWhitelistType } from '../../utils/cacher/nftPools';
import { NftPoolsContext } from './nftPools.context';
import { NftPoolsContextValues, UseNftPool } from './nftPools.model';

export const useNftPools = (): NftPoolsContextValues => {
  const context = useContext(NftPoolsContext);

  useEffect(() => {
    const { isPolling, startPolling, stopPolling } = context;

    stopPolling();
    return () => !isPolling && startPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context;
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
      return Object.fromEntries(
        pool.poolWhitelist
          .filter(
            ({ whitelistType }) =>
              whitelistType === PoolWhitelistType.SINGLE_NFT_WHITELIST,
          )
          .map(({ whitelistedAddress }) => [
            whitelistedAddress.toBase58(),
            true,
          ]),
      );
    }
    return {};
  }, [pool]);

  const whitelistedCreatorsDictionary = useMemo(() => {
    if (pool) {
      return Object.fromEntries(
        pool.poolWhitelist
          .filter(
            ({ whitelistType }) =>
              whitelistType === PoolWhitelistType.CREATOR_WHITELIST,
          )
          .map(({ whitelistedAddress }) => [
            whitelistedAddress.toBase58(),
            true,
          ]),
      );
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
