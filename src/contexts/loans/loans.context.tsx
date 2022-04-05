import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  EstimateNFT,
  FetchDataFunc,
  LoansContextValues,
  LoansProviderType,
} from './loans.model';
import {
  LoanWithNftData,
  fetchLoans,
  fetchCollectionsData,
  login,
} from '../../utils/loans';

export const LoansPoolsContext = React.createContext<LoansContextValues>({
  loading: true,
  loansData: [],
  fetchLoansData: () => Promise.resolve(null),
  estimations: [],
  isPawnshopAuthenticated: false,
  pawnshopLogin: () => Promise.resolve(null),
});

export const LoansProvider: LoansProviderType = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loansData, setLoansData] = useState<LoanWithNftData[]>([]);
  const wallet = useWallet();
  const [estimations, setEstimations] = useState<EstimateNFT[]>([]);

  const [isPawnshopAuthenticated, setIsPawnshopAuthenticated] = useState(false);

  useEffect(() => {
    const walletLS = localStorage.getItem('wallet');
    const walletName = localStorage.getItem('walletName');

    if (walletLS && walletName) {
      setIsPawnshopAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPawnshopAuthenticated]);

  const pawnshopLogin = async (): Promise<void> => {
    if (!isPawnshopAuthenticated) {
      const isLogin = await login(wallet);
      if (isLogin) {
        setIsPawnshopAuthenticated(true);
      }
    } else {
      setIsPawnshopAuthenticated(false);
    }
  };

  const fetchLoansData: FetchDataFunc = async () => {
    try {
      const [allLoansData, allCollectionData] = await Promise.all([
        fetchLoans(),
        fetchCollectionsData(),
      ]);

      setEstimations(allCollectionData);
      setLoansData(allLoansData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.connected && isPawnshopAuthenticated) {
      fetchLoansData();
    }
  }, [wallet.connected, isPawnshopAuthenticated]);

  return (
    <LoansPoolsContext.Provider
      value={{
        loading,
        loansData,
        fetchLoansData,
        estimations,
        pawnshopLogin,
        isPawnshopAuthenticated,
      }}
    >
      {children}
    </LoansPoolsContext.Provider>
  );
};
