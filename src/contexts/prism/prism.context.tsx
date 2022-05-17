import { useState, createContext, useEffect } from 'react';
import { Prism } from '@prism-hq/prism-ag';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { PrismContextValues, PrismProviderType } from './prism.model';
import { useTokenListContext } from '../TokenList';
import { prismSwap } from './transactions';

export const PrismContext = createContext<PrismContextValues>({
  loading: true,
  prismSwap: () => Promise.resolve(null),
  prism: null,
});

export const PrismProvider: PrismProviderType = ({ children }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const { tokensList, loading: tokensListLoading } = useTokenListContext();
  const [loadingPrism, setLoadingPrism] = useState<boolean>(true);
  const [prism, setPrism] = useState<any>();

  const fetchPrismaData = async (): Promise<void> => {
    try {
      const initPrism = async () => {
        return await Prism.init({
          user: wallet.publicKey,
          connection: connection,
          tokenList: { tokens: tokensList },
        });
      };

      const prism = await initPrism();
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
  }, [tokensListLoading]);

  return (
    <PrismContext.Provider
      value={{
        loading: loadingPrism,
        prism,
        prismSwap: prismSwap({
          connection,
          wallet,
        }),
      }}
    >
      {children}
    </PrismContext.Provider>
  );
};
