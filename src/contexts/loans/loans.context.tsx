import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAllProgramAccounts } from '@frakters/nft-lending-v2';
import { PublicKey } from '@solana/web3.js';

import {
  FetchDataFunc,
  LoansProgramAccount,
  LoansContextValues,
  LoansProviderType,
} from './loans.model';
import { proposeLoan, paybackLoan } from './transactions';
import { LOANS_PROGRAM_PUBKEY } from './loans.constants';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: true,
  loansProgramAccounts: null,
  fetchLoansData: () => Promise.resolve(null),
  paybackLoan: () => Promise.resolve(null),
  proposeLoan: () => Promise.resolve(null),
  approvedLoan: () => Promise.resolve(null),
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const wallet = useWallet();
  const { connection } = useConnection();
  const [loansProgramAccounts, setLoansProgramAccounts] =
    useState<LoansProgramAccount>();

  const fetchLoansData: FetchDataFunc = async () => {
    try {
      const programAccounts = await getAllProgramAccounts(
        new PublicKey(LOANS_PROGRAM_PUBKEY),
        connection,
      );
      console.log(programAccounts);
      setLoansProgramAccounts(programAccounts);
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
        fetchLoansData,
        paybackLoan: paybackLoan({
          connection,
          wallet,
        }),
        proposeLoan: proposeLoan({
          connection,
          wallet,
        }),
        approvedLoan: proposeLoan({
          connection,
          wallet,
        }),
      }}
    >
      {children}
    </LoansPoolsContext.Provider>
  );
};
