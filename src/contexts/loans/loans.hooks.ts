import { LoanView } from '@frakters/nft-lending-v2';
import { useWallet } from '@solana/wallet-adapter-react';
import { useContext, useMemo, useEffect, useState } from 'react';

import { LoansPoolsContext } from './loans.context';
import { LoansContextValues, LoanWithArweaveMetadata } from './loans.model';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';

export const useLoans = (): LoansContextValues => {
  const context = useContext(LoansPoolsContext);
  if (context === null) {
    throw new Error('LoansContext not available');
  }
  return context;
};

export const useLoansInitialFetch = (): void => {
  const { loading, loanDataByPoolPublicKey, initialFetch } = useLoans();

  useEffect(() => {
    if (!loading && !loanDataByPoolPublicKey.size) {
      initialFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

type UseUserLoans = () => {
  loading: boolean;
  userLoans: LoanWithArweaveMetadata[];
};

export const useUserLoans: UseUserLoans = () => {
  const { loading: loansLoading, loanDataByPoolPublicKey } = useLoans();
  const [userLoans, setUserLoans] = useState<LoanWithArweaveMetadata[]>([]);
  const [metadataLoading, setMetadataLoading] = useState<boolean>(false);

  const wallet = useWallet();

  const amountOfLoans = useMemo(() => {
    return (
      Array.from(loanDataByPoolPublicKey.values()).reduce(
        (acc, { loans }) => acc + loans.length,
        0,
      ) || 0
    );
  }, [loanDataByPoolPublicKey]);

  const loans = useMemo(() => {
    if (amountOfLoans && !loansLoading && wallet.connected) {
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

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountOfLoans, loansLoading, wallet.connected]);

  const fetchMetadataAndInitialize = async () => {
    try {
      setMetadataLoading(true);
      const mints = loans.map(({ nftMint }) => nftMint);
      const metadataByMint = await getArweaveMetadataByMint(mints);

      const userLoans = loans.map((loan) => {
        const metadata = metadataByMint[loan?.nftMint] || null;

        return {
          loan,
          metadata,
        };
      });

      setUserLoans(userLoans);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setMetadataLoading(false);
    }
  };

  useEffect(() => {
    if (loans.length) {
      fetchMetadataAndInitialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans.length]);

  const loading = wallet.connected ? loansLoading || metadataLoading : false;

  return {
    loading,
    userLoans: wallet.connected ? userLoans : [],
  };
};
