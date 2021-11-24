import React, { useEffect, useMemo, useState } from 'react';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';

import { TokenListContextInterface } from './tokenList.model';
import {
  ADDITIONAL_SWAPPABLE_TOKENS_MINTS,
  VERIFIED_BY_FRAKT_TEAM_TOKENS_URL,
} from './tokenList.contants';

export const TokenListContext = React.createContext<TokenListContextInterface>({
  tokenList: [],
  tokenMap: new Map<string, TokenInfo>(),
  swappableTokensMap: new Map<string, TokenInfo>(),
  fraktionTokensList: [],
  fraktionTokensMap: new Map<string, TokenInfo>(),
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
  const [fraktionTokensList, setFraktionTokensList] = useState<TokenInfo[]>([]);
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
        setFraktionTokensList(fraktList);
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
    //? Add additional tokens (such is FRKT and RAY for swap and etc.)
    ADDITIONAL_SWAPPABLE_TOKENS_MINTS.forEach((mint) => {
      swappableTokensMap.set(mint, tokenMap.get(mint));
    });
    return swappableTokensMap;
  }, [swappableTokensList, tokenMap]);

  //? Fraktion map for quick lookup.
  const fraktionTokensMap = useMemo(() => {
    const fraktionTokensMap = new Map();
    fraktionTokensList.forEach((token: TokenInfo) => {
      fraktionTokensMap.set(token.address, token);
    });
    return fraktionTokensMap;
  }, [fraktionTokensList]);

  return (
    <TokenListContext.Provider
      value={{
        tokenMap,
        loading,
        tokenList,
        swappableTokensMap,
        fraktionTokensList,
        fraktionTokensMap,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
};
