import React, { useContext, useEffect, useState } from 'react';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';

interface SolanaTokenRegistryInterface {
  loading: boolean;
  tokens: TokenInfo[];
  isTickerAvailable: (ticker: string) => boolean;
  getTokerByMint: (tokenMint: string) => string | null;
}

const SolanaTokenRegistryContext =
  React.createContext<SolanaTokenRegistryInterface>({
    loading: false,
    tokens: [],
    isTickerAvailable: () => false,
    getTokerByMint: () => null,
  });

export const SolanaTokenRegistryProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    new TokenListProvider()
      .resolve()
      .then((tokens) => {
        const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
        setTokens(tokenList);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const isTickerAvailable = (tokerName: string) =>
    !tokens.find(({ symbol }) => symbol === tokerName);

  const getTokerByMint = (tokenMint: string): string | null => {
    const token = tokens.find(({ address }) => address === tokenMint);
    return token?.symbol || null;
  };

  return (
    <SolanaTokenRegistryContext.Provider
      value={{ loading, tokens, isTickerAvailable, getTokerByMint }}
    >
      {children}
    </SolanaTokenRegistryContext.Provider>
  );
};

export const useSolanaTokenRegistry = (): SolanaTokenRegistryInterface => {
  const { loading, tokens, isTickerAvailable, getTokerByMint } = useContext(
    SolanaTokenRegistryContext,
  );

  return { loading, tokens, isTickerAvailable, getTokerByMint };
};
