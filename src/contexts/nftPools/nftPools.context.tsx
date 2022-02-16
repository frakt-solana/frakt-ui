import React, { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import { usePolling } from '../../hooks';
import {
  FetchDataFunc,
  NftPoolsContextValues,
  PoolsState,
} from './nftPools.model';
import { getAllProgramAccounts } from './nftPools';
import { DEFAULT_POOLS_STATE } from './nftPools.constants';
import { Cacher } from '../../utils/cacher';

export const NftPoolsContext = React.createContext<NftPoolsContextValues>({
  poolsState: DEFAULT_POOLS_STATE,
  loading: true,
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
  const [loading, setLoading] = useState<boolean>(true);
  const [poolsState, setPoolsState] = useState<PoolsState>(DEFAULT_POOLS_STATE);
  const { connection } = useConnection();

  const initialFetch: FetchDataFunc = async () => {
    try {
      setLoading(true);
      await Cacher.getNftPools();

      // const info = await getAllProgramAccounts({ connection });
      // setPoolsState(info);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const silentFetch: FetchDataFunc = async () => {
    try {
      const info = await getAllProgramAccounts({ connection });
      setPoolsState(info);
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
        poolsState,
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
