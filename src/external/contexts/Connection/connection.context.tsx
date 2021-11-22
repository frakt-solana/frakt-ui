import { Account, Connection } from '@solana/web3.js';
import { ENV as ChainID } from '@solana/spl-token-registry';
import React, { useEffect, useMemo } from 'react';

import { DEFAULT_ENDPOINT, DEFAULT_SLIPPAGE } from './connection.constants';
import {
  ConnectionContextInterface,
  ConnectionProviderProps,
} from './connection.model';
import { useLocalStorageState } from '../../hooks';

export const ConnectionContext =
  React.createContext<ConnectionContextInterface>({
    endpoint: DEFAULT_ENDPOINT,
    slippage: DEFAULT_SLIPPAGE,
    setSlippage: () => {},
    connection: new Connection(DEFAULT_ENDPOINT, 'confirmed'),
    env: 'mainnet-beta',
    chainId: ChainID.MainnetBeta,
  });

const ConnectionProvider = ({
  children = null,
  endpoint = DEFAULT_ENDPOINT,
  isDev = false,
}: ConnectionProviderProps): JSX.Element => {
  const [slippage, setSlippage] = useLocalStorageState(
    'slippage',
    DEFAULT_SLIPPAGE.toString(),
  );

  const connection = useMemo(
    () => new Connection(endpoint, 'confirmed'),
    [endpoint],
  );

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(new Account().publicKey, () => {});
    return (): void => {
      connection.removeAccountChangeListener(id);
    };
  }, [connection]);

  useEffect(() => {
    const id = connection.onSlotChange(() => null);
    return (): void => {
      connection.removeSlotChangeListener(id);
    };
  }, [connection]);

  return (
    <ConnectionContext.Provider
      value={{
        endpoint,
        slippage: parseFloat(slippage),
        setSlippage: (val): void => setSlippage(val.toString()),
        connection,
        env: isDev ? 'devnet' : 'mainnet-beta',
        chainId: isDev ? ChainID.Devnet : ChainID.MainnetBeta,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
