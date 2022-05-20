import { useState, createContext, useEffect } from 'react';
import { Prism } from '@prism-hq/prism-ag';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { PrismContextValues, PrismProviderType } from './prism.model';
import { useTokenListContext } from '../TokenList';

export const PrismContext = createContext<PrismContextValues>({
  loading: true,
  prism: null,
});

export const PrismProvider: PrismProviderType = ({ children }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const { tokensList, loading: tokensListLoading } = useTokenListContext();
  const [loadingPrism, setLoadingPrism] = useState<boolean>(true);
  const [prism, setPrism] = useState<Prism | null>(null);

  const fetchPrismaData = async (): Promise<void> => {
    try {
      const prism = await Prism.init({
        user: wallet.publicKey,
        connection: connection,
        tokenList: { tokens: tokensList },
      });

      setPrism(prism);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoadingPrism(false);
    }
  };

  useEffect(() => {
    if (!tokensListLoading) {
      fetchPrismaData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensListLoading, wallet.connected]);

  return (
    <PrismContext.Provider
      value={{
        loading: loadingPrism,
        prism,
      }}
    >
      {children}
    </PrismContext.Provider>
  );
};
