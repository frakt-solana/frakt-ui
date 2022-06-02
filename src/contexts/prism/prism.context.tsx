import { useState, createContext, useEffect } from 'react';
import { Prism } from '@prism-hq/prism-ag';
import { useWallet } from '@solana/wallet-adapter-react';

import { PrismContextValues, PrismProviderValues } from './prism.model';
import { useTokenListContext } from '../TokenList';
import { useConnection } from '../../hooks';

export const PrismContext = createContext<PrismContextValues>({
  loading: true,
  prism: null,
});

export const PrismProvider: PrismProviderValues = ({ children }) => {
  const wallet = useWallet();
  const connection = useConnection();

  const { tokensList, loading: tokensListLoading } = useTokenListContext();
  const [prismInitialised, setPrismInitialised] = useState<boolean>(false);
  const [prism, setPrism] = useState<Prism | null>(null);

  const fetchPrismaData = async (): Promise<void> => {
    try {
      const prism = await Prism.init({
        connection: connection,
        tokenList: { tokens: tokensList },
      });

      setPrism(prism);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setPrismInitialised(false);
    }
  };

  useEffect(() => {
    if (wallet && wallet.publicKey && prism) prism.setSigner(wallet);
  }, [wallet, prism]);

  useEffect(() => {
    if (!tokensListLoading) {
      fetchPrismaData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensListLoading, wallet.connected]);

  return (
    <PrismContext.Provider
      value={{
        loading: prismInitialised,
        prism,
      }}
    >
      {children}
    </PrismContext.Provider>
  );
};
