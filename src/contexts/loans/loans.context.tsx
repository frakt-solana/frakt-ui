import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { LoansContextValues, LoansProviderType } from './loans.model';
import LoanService from '../../services/LoansService';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: true,
  loansData: [],
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const wallet = useWallet();

  const [loading, setLoading] = useState<boolean>(true);
  const [loansData, setLoansData] = useState();

  const fetchLoansData = async (): Promise<any> => {
    if (wallet) {
      try {
        const allLoansData = await LoanService.fetchLoans();
        setLoansData(allLoansData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (wallet.publicKey && wallet.connected) {
      fetchLoansData();
    }
  }, [wallet]);

  return (
    <LoansPoolsContext.Provider value={{ loading, loansData }}>
      {children}
    </LoansPoolsContext.Provider>
  );
};
