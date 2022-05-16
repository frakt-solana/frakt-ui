import React, { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LoanView } from '@frakters/nft-lending-v2';

import {
  FetchDataFunc,
  LoansContextValues,
  LoansProviderType,
  LoanData,
  LoanDataByPoolPublicKey,
  RemoveLoanOptimistic,
  LoanWithArweaveMetadata,
} from './loans.model';
import { fetchLoanDataByPoolPublicKey } from './loans.helpers';
import { usePolling } from '../../hooks';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: false,
  loanDataByPoolPublicKey: new Map<string, LoanData>(),
  userLoans: [],
  userLoansLoading: false,
  initialFetch: () => Promise.resolve(null),
  refetch: () => Promise.resolve(null),
  removeLoanOptimistic: () => {},
  isPolling: false,
  startPolling: () => {},
  stopPolling: () => {},
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const wallet = useWallet();

  const [loading, setLoading] = useState<boolean>(false);
  const { connection } = useConnection();

  const [loanDataByPoolPublicKey, setLoanDataByPoolPublicKey] =
    useState<LoanDataByPoolPublicKey>(new Map<string, LoanData>());

  const [userLoans, setUserLoans] = useState<LoanWithArweaveMetadata[]>([]);
  const [metadataLoading, setMetadataLoading] = useState<boolean>(false);

  const fetchLoansData: FetchDataFunc = async (): Promise<void> => {
    const loansData = await fetchLoanDataByPoolPublicKey(connection);
    setLoanDataByPoolPublicKey(loansData);
  };

  const initialFetch: FetchDataFunc = async (): Promise<void> => {
    try {
      setLoading(true);
      await fetchLoansData();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const silentFetch: FetchDataFunc = async (): Promise<void> => {
    try {
      await fetchLoansData();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const removeLoanOptimistic: RemoveLoanOptimistic = (loan: LoanView) => {
    const loanPoolPubkey = loan?.liquidityPool;
    const loanData = loanDataByPoolPublicKey.get(loanPoolPubkey);

    const nextLoanDataByPoolPublicKey = new Map(
      loanDataByPoolPublicKey.set(loanPoolPubkey, {
        ...loanData,
        loans:
          loanData?.loans?.filter(
            ({ loanPubkey }) => loanPubkey !== loan?.loanPubkey,
          ) || [],
      }),
    );

    setLoanDataByPoolPublicKey(nextLoanDataByPoolPublicKey);

    setUserLoans(
      userLoans.filter(
        ({ loan: userLoan }) => userLoan?.loanPubkey !== loan?.loanPubkey,
      ),
    );
  };

  const userLoansWithoutMetadata = useMemo(() => {
    if (loanDataByPoolPublicKey.size && !loading && wallet.connected) {
      return Array.from(loanDataByPoolPublicKey.values())
        .reduce((loans: LoanView[], loanData) => {
          const userLoans =
            loanData?.loans?.filter(
              ({ loanStatus, user }) =>
                !!loanStatus?.activated &&
                user === wallet.publicKey?.toBase58(),
            ) || [];

          return [...loans, ...userLoans];
        }, [])
        .sort(
          (userLoanA, userLoanB) => userLoanB.finishedAt - userLoanA.finishedAt,
        );
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanDataByPoolPublicKey, loading, wallet.connected]);

  const fetchMetadataAndInitialize = async () => {
    try {
      if (!userLoans.length) {
        setMetadataLoading(true);
      }
      const mints = userLoansWithoutMetadata.map(({ nftMint }) => nftMint);
      const metadataByMint = await getArweaveMetadataByMint(mints);

      const fetchedUserLoans = userLoansWithoutMetadata.map((loan) => {
        const metadata = metadataByMint[loan?.nftMint] || null;

        return {
          loan,
          metadata,
        };
      });

      setUserLoans(fetchedUserLoans);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setMetadataLoading(false);
    }
  };

  useEffect(() => {
    if (userLoansWithoutMetadata.length) {
      fetchMetadataAndInitialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoansWithoutMetadata]);

  const userLoansLoading = wallet.connected
    ? loading || metadataLoading
    : false;

  const { isPolling, startPolling, stopPolling } = usePolling(
    silentFetch,
    15000,
  );

  return (
    <LoansPoolsContext.Provider
      value={{
        loading,
        loanDataByPoolPublicKey,
        userLoans,
        userLoansLoading,
        initialFetch,
        refetch: silentFetch,
        removeLoanOptimistic,
        isPolling,
        startPolling,
        stopPolling,
      }}
    >
      {children}
    </LoansPoolsContext.Provider>
  );
};