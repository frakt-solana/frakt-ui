import React, { useEffect, useMemo, useState } from 'react';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';
import { TokenListContextInterface } from './tokenList.model';
import { VERIFIED_BY_FRAKT_TEAM_TOKENS_URL } from './tokenList.contants';

export const TokenListContext = React.createContext<TokenListContextInterface>({
  tokenMap: new Map<string, TokenInfo>(),
  tokenList: [],
  loading: false,
});

const TokenListContextProvider = ({
  children = null,
}: {
  children: JSX.Element | null;
}): JSX.Element => {
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(VERIFIED_BY_FRAKT_TEAM_TOKENS_URL).then((res) => res.json()), //? For future implementation
      new TokenListProvider()
        .resolve()
        .then((tokens) => tokens.filterByClusterSlug('mainnet-beta').getList()),
    ])
      .then(([fraktList, solanaList]) => {
        setTokenList([...fraktList, ...solanaList]); //? Manually add a fake SOL mint for the native token. The component is opinionated in that it distinguishes between wrapped SOL and SOL.
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

  //? Tokens with USD(x) quoted markets.
  // const swappableTokens = useMemo(() => {
  //   const tokens = tokenList.filter((token: TokenInfo) => {
  //     const isUsdxQuoted =
  //       token.extensions?.serumV3Usdt || token.extensions?.serumV3Usdc;
  //     // token.symbol === 'FRKT' //? Force add FRKT token
  //     return isUsdxQuoted;
  //   });
  //   tokens.sort((tokenA: TokenInfo, tokenB: TokenInfo) =>
  //     tokenA.symbol < tokenB.symbol
  //       ? -1
  //       : tokenA.symbol > tokenB.symbol
  //       ? 1
  //       : 0,
  //   );
  //   return tokens;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tokenList, tokenMap]);

  return (
    <TokenListContext.Provider
      value={{
        tokenMap,
        loading,
        tokenList,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
};

export default TokenListContextProvider;
