import React, { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
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
  loading: false,
  loanDataByPoolPublicKey: new Map<string, LoanData>(),
  initialFetch: () => Promise.resolve(null),
  removeLoanOptimistic: () => {},
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
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
        initialFetch: fetchLoansData,
        removeLoanOptimistic,
      }}
    >
      {children}
    </LoansPoolsContext.Provider>
  );
};
