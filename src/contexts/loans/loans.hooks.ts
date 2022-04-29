import { LoanView } from '@frakters/nft-lending-v2';
import { useWallet } from '@solana/wallet-adapter-react';
import { useContext, useMemo } from 'react';

import { LoansPoolsContext } from './loans.context';
import { LoansContextValues } from './loans.model';

export const useLoans = (): LoansContextValues => {
  const context = useContext(LoansPoolsContext);
  if (context === null) {
    throw new Error('LoansContext not available');
  }
  return context;
};

type UseUserLoans = () => {
  loading: boolean;
  userLoans: LoanView[];
};

export const useUserLoans: UseUserLoans = () => {
  const { loading, loanDataByPoolPublicKey } = useLoans();
  const wallet = useWallet();

  const userLoans = useMemo(() => {
    if (loanDataByPoolPublicKey?.size && !loading && wallet.connected) {
      return Array.from(loanDataByPoolPublicKey.values()).reduce(
        (loans: LoanView[], loanData) => {
          const userLoans =
            loanData?.loans?.filter(
              ({ loanStatus, user }) =>
                !!loanStatus?.activated &&
                user === wallet.publicKey?.toBase58(),
            ) || [];

          return [...loans, ...userLoans];
        },
        [],
      );
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanDataByPoolPublicKey?.size, loading, wallet.connected]);

  return {
    loading,
    userLoans,
  };
};
