import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LoanView } from '@frakters/nft-lending-v2';

import {
  FetchDataFunc,
  LoansContextValues,
  LoansProviderType,
  LoanData,
  LoanDataByPoolPublicKey,
  RemoveLoanOptimistic,
} from './loans.model';
import { fetchLoanDataByPoolPublicKey } from './loans.helpers';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: true,
  loanDataByPoolPublicKey: new Map<string, LoanData>(),
  fetchLoansData: () => Promise.resolve(null),
  removeLoanOptimistic: () => {},
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const wallet = useWallet();
  const { connection } = useConnection();

  const [loanDataByPoolPublicKey, setLoanDataByPoolPublicKey] =
    useState<LoanDataByPoolPublicKey>(new Map<string, LoanData>());

  const fetchLoansData: FetchDataFunc = async (): Promise<void> => {
    try {
      const loansData = await fetchLoanDataByPoolPublicKey(connection);

      setLoanDataByPoolPublicKey(loansData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected]);

  const removeLoanOptimistic: RemoveLoanOptimistic = (loan: LoanView) => {
    const loanPoolPubkey = loan?.liquidityPool;
    const loanData = loanDataByPoolPublicKey.get(loanPoolPubkey);

    setLoanDataByPoolPublicKey(
      loanDataByPoolPublicKey.set(loanPoolPubkey, {
        ...loanData,
        loans:
          loanData?.loans?.filter(
            ({ loanPubkey }) => loanPubkey !== loan?.loanPubkey,
          ) || [],
      }),
    );
  };

  return (
    <LoansPoolsContext.Provider
      value={{
        loading,
        loanDataByPoolPublicKey,
        fetchLoansData,
        removeLoanOptimistic,
      }}
    >
      {children}
    </LoansPoolsContext.Provider>
  );
};
