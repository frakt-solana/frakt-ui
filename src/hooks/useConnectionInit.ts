import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { commonActions } from '../state/common/actions';

export const useConnectionInit = (): void => {
  const { connection } = useConnection();
  const dispatch = useDispatch();

  useEffect(() => {
    if (connection) {
      dispatch(commonActions.setConnection(connection));
    }
  }, [connection, dispatch]);
};
