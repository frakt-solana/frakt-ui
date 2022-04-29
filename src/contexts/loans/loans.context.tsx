import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import {
  FetchDataFunc,
  LoansProgramAccounts,
  LoansContextValues,
  LoansProviderType,
  AvailableCollections,
} from './loans.model';
import { proposeLoan, paybackLoan } from './transactions';
import {
  fetchLoansProgramAccounts,
  fetchAvailableCollections,
} from './loans.helpers';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: true,
  loansProgramAccounts: null,
  availableCollections: [],
  fetchLoansData: () => Promise.resolve(null),
  paybackLoan: () => Promise.resolve(null),
  proposeLoan: () => Promise.resolve(null),
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const wallet = useWallet();
  const { connection } = useConnection();
  const [loansProgramAccounts, setLoansProgramAccounts] =
    useState<LoansProgramAccounts>();

  const [availableCollections, setAvailableCollections] = useState<
    AvailableCollections[]
  >([]);

  const fetchLoansData: FetchDataFunc = async (): Promise<void> => {
    try {
      const programAccounts = await fetchLoansProgramAccounts(connection);
      const availableCollection = await fetchAvailableCollections();
      setLoansProgramAccounts(programAccounts);
      setAvailableCollections(availableCollection);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchLoansData();
    }
  }, [wallet.connected]);

  return (
    <LoansPoolsContext.Provider
      value={{
        loading,
        loansProgramAccounts,
        availableCollections,
        fetchLoansData,
        paybackLoan: paybackLoan({
          connection,
          wallet,
        }),
        proposeLoan: proposeLoan({
          connection,
          wallet,
        }),
      }}
    >
      {children}
    </LoansPoolsContext.Provider>
  );
};
