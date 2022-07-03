import { useConnection } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ENDPOINT } from '../config';
import { commonActions } from '../state/common/actions';

export const useConnectionInit = (): void => {
  const { connection } = useConnection();
  const dispatch = useDispatch();

  useEffect(() => {
    if (connection) {
      dispatch(commonActions.setConnection(new Connection(ENDPOINT)));
    }
  }, [connection, dispatch]);
};
