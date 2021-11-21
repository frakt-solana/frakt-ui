import React, { useContext, useEffect, useState } from 'react';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';

const VERIFIED_BY_FRAKT_TEAM_TOKENS_URL =
  'https://raw.githubusercontent.com/frakt-solana/fraktion-tokens-list/main/tokens.json';

interface SolanaTokenRegistryInterface {
  loading: boolean;
  tokens: TokenInfo[];
  fraktionTokens: TokenInfo[];
  isTickerAvailable: (ticker: string) => boolean;
  getTokerByMint: (tokenMint: string) => string | null;
}

const SolanaTokenRegistryContext =
  React.createContext<SolanaTokenRegistryInterface>({
    loading: false,
    tokens: [],
    fraktionTokens: [],
    isTickerAvailable: () => false,
    getTokerByMint: () => null,
  });

export const SolanaTokenRegistryProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [fraktionTokens, setFraktionTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(VERIFIED_BY_FRAKT_TEAM_TOKENS_URL).then((res) => res.json()),
      new TokenListProvider()
        .resolve()
        .then((tokens) => tokens.filterByClusterSlug('mainnet-beta').getList()),
    ])
      .then(([fraktList, solanaList]) => {
        setTokens([...fraktList, ...solanaList]);
        setFraktionTokens(fraktList);
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
      value={{
        loading,
        tokens,
        fraktionTokens,
        isTickerAvailable,
        getTokerByMint,
      }}
    >
      {children}
    </SolanaTokenRegistryContext.Provider>
  );
};

export const useSolanaTokenRegistry = (): SolanaTokenRegistryInterface => {
  const { loading, tokens, fraktionTokens, isTickerAvailable, getTokerByMint } =
    useContext(SolanaTokenRegistryContext);

  return { loading, tokens, fraktionTokens, isTickerAvailable, getTokerByMint };
};
