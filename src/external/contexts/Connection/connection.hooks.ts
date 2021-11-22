import { useContext } from 'react';
import { Connection } from '@solana/web3.js';

import { ConnectionContext } from './connection.context';
import { ConnectionContextInterface } from './connection.model';

export const useConnectionContext = (): ConnectionContextInterface => {
  return useContext(ConnectionContext);
};

export const useConnection = (): Connection => {
  return useContext(ConnectionContext).connection;
};
