import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  FetchDataFunc,
  LoansContextValues,
  LoansProviderType,
} from './loans.model';
import { LoanWithNftData, fetchLoans } from '../../utils/loans';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: true,
  loansData: [],
  fetchLoansData: () => Promise.resolve(null),
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loansData, setLoansData] = useState<LoanWithNftData[]>([]);
  const wallet = useWallet();

  const fetchLoansData: FetchDataFunc = async () => {
    try {
      const allLoansData = await fetchLoans();

      setLoansData(allLoansData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      fetchLoansData();
    }
  }, [wallet]);

  return (
    <LoansPoolsContext.Provider value={{ loading, loansData, fetchLoansData }}>
      {children}
    </LoansPoolsContext.Provider>
  );
};
