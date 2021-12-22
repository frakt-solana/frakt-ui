import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { URLS } from '../constants';

export const usePrivatePage = (): void => {
  const { connected } = useWallet();
  const history = useHistory();

  useEffect(() => {
    !connected && history.push(URLS.WALLET);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);
};
