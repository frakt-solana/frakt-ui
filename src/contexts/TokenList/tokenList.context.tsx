import React, { useEffect, useMemo, useState } from 'react';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';
import { TokenListContextInterface } from './tokenList.model';
import { VERIFIED_BY_FRAKT_TEAM_TOKENS_URL } from './tokenList.contants';

export const TokenListContext = React.createContext<TokenListContextInterface>({
  tokenMap: new Map<string, TokenInfo>(),
  tokenList: [],
  swappableTokensMap: new Map<string, TokenInfo>(),
  swappableTokensList: [],
  loading: false,
});

export const TokenListContextProvider = ({
  children = null,
}: {
  children: JSX.Element | null;
}): JSX.Element => {
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);
  const [swappableTokensList, setSwappableTokensList] = useState<TokenInfo[]>(
    [],
  );
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
        setTokenList([...fraktList, ...solanaList]);
        setSwappableTokensList(fraktList);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //? Token map for quick lookup.
  const tokenMap = useMemo(() => {
    const tokenMap = new Map();
    tokenList.forEach((token: TokenInfo) => {
      tokenMap.set(token.address, token);
    });
    return tokenMap;
  }, [tokenList]);

  //? Swappable token map for quick lookup.
  const swappableTokensMap = useMemo(() => {
    const swappableTokensMap = new Map();
    swappableTokensList.forEach((token: TokenInfo) => {
      swappableTokensMap.set(token.address, token);
    });
    return swappableTokensMap;
  }, [swappableTokensList]);

  return (
    <TokenListContext.Provider
      value={{
        tokenMap,
        loading,
        tokenList,
        swappableTokensList,
        swappableTokensMap,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
};
