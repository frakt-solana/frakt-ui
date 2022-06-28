import React, { useState } from 'react';

import { usePolling } from '../../hooks';
import { FetchDataFunc, NftPoolsContextValues } from './nftPools.model';
import { Cacher } from '../../utils/cacher';
import { NftPoolData } from '../../utils/cacher/nftPools';

export const NftPoolsContext = React.createContext<NftPoolsContextValues>({
  pools: [],
  loading: false,
  initialFetch: () => Promise.resolve(null),
  refetch: () => Promise.resolve(null),
  isPolling: false,
  startPolling: () => {},
  stopPolling: () => {},
});

export const NftPoolsProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pools, setPools] = useState<NftPoolData[]>([]);

  const initialFetch: FetchDataFunc = async () => {
    try {
      setLoading(true);
      const pools = await Cacher.getNftPools();
      setPools(pools);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const silentFetch: FetchDataFunc = async () => {
    try {
      const pools = await Cacher.getNftPools();
      setPools(pools);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const { isPolling, startPolling, stopPolling } = usePolling(
    silentFetch,
    10000,
  );

  return (
    <NftPoolsContext.Provider
      value={{
        pools,
        loading,
        initialFetch,
        refetch: silentFetch,
        isPolling,
        startPolling,
        stopPolling,
      }}
    >
      {children}
    </NftPoolsContext.Provider>
  );
};
