import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAllProgramAccounts } from '@frakters/nft-lending-v2';
import { PublicKey } from '@solana/web3.js';

import {
  FetchDataFunc,
  LoanProgramAccount,
  LoansContextValues,
  LoansProviderType,
} from './loans.model';
import { createLoan, getLoanBack } from './transactions';
import { LOANS_PROGRAM_PUBKEY } from './loans.constants';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: true,
  fetchLoansData: () => Promise.resolve(null),
  getLoanBack: () => Promise.resolve(null),
  createLoan: () => Promise.resolve(null),
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const wallet = useWallet();
  const { connection } = useConnection();
  const [loansProgramAccounts, setLoansProgramAccounts] =
    useState<LoanProgramAccount>();

  const fetchLoansData: FetchDataFunc = async () => {
    try {
      const programAccounts = await getAllProgramAccounts(
        new PublicKey(LOANS_PROGRAM_PUBKEY),
        connection,
      );
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
        fetchLoansData,
        getLoanBack: getLoanBack({
          connection,
          wallet,
        }),
        createLoan: createLoan({
          connection,
          wallet,
        }),
      }}
    >
      {children}
    </LoansPoolsContext.Provider>
  );
};
