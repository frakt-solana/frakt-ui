import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import {
  FetchDataFunc,
  LoansProgramAccounts,
  LoansContextValues,
  LoansProviderType,
  AvailableCollections,
  LoanData,
  LoanDataByPoolPublicKey,
} from './loans.model';
import { proposeLoan, paybackLoan } from './transactions';
import {
  fetchLoansProgramAccounts_old,
  fetchAvailableCollections,
  fetchLoanDataByPoolPublicKey,
} from './loans.helpers';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: true,
  loansProgramAccounts: null,
  loanDataByPoolPublicKey: new Map<string, LoanData>(),
  availableCollections: [],
  fetchLoansData: () => Promise.resolve(null),
  paybackLoan: () => Promise.resolve(null),
  proposeLoan: () => Promise.resolve(null),
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const wallet = useWallet();
  const { connection } = useConnection();

  const [loanDataByPoolPublicKey, setLoanDataByPoolPublicKey] =
    useState<LoanDataByPoolPublicKey>(new Map<string, LoanData>());

  const [loansProgramAccounts, setLoansProgramAccounts] =
    useState<LoansProgramAccounts>();

  const [availableCollections, setAvailableCollections] = useState<
    AvailableCollections[]
  >([]);

  const fetchLoansData1: FetchDataFunc = async (): Promise<void> => {
    try {
      const programAccounts = await fetchLoansProgramAccounts_old(connection);

      const loansData = await fetchLoanDataByPoolPublicKey(connection);

      const availableCollections = await fetchAvailableCollections();

      setLoanDataByPoolPublicKey(loansData);
      setLoansProgramAccounts(programAccounts);
      setAvailableCollections(availableCollections);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchLoansData1();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected]);

  return (
    <LoansPoolsContext.Provider
      value={{
        loading,
        loanDataByPoolPublicKey,
        loansProgramAccounts,
        availableCollections,
        fetchLoansData: fetchLoansData1,
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
