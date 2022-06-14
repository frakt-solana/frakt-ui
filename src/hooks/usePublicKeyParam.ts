import { web3 } from '@frakt-protocol/frakt-sdk';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { PATHS } from '../constants';

export const usePublicKeyParam = (key: string): void => {
  const history = useHistory();

  useEffect(() => {
    try {
      new web3.PublicKey(key);
    } catch {
      history.push(PATHS.PAGE_404);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
};
