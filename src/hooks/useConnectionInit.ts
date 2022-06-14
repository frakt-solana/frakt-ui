import { useConnection } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ENDPOINT } from '../config';
import { commonActions } from '../state/common/actions';

export const useConnectionInit = (): void => {
  const { connection } = useConnection();
  const dispatch = useDispatch();

  useEffect(() => {
    if (connection) {
      dispatch(commonActions.setConnection(new web3.Connection(ENDPOINT)));
    }
  }, [connection, dispatch]);
};
