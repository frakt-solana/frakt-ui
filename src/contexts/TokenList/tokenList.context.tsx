import React, { useEffect, useMemo, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { TokenListContextInterface } from './tokenList.model';
import { ADDITIONAL_SWAPPABLE_TOKENS_MINTS } from './tokenList.contants';

export const TokenListContext = React.createContext<TokenListContextInterface>({
  tokensList: [],
  tokensMap: new Map<string, TokenInfo>(),
  fraktionTokensList: [],
  fraktionTokensMap: new Map<string, TokenInfo>(),
  loading: true,
});

//? Don't use TokenListProvider because it's binded with json with 3MB+ size
const getSolanaTokens = async (): Promise<TokenInfo[]> => {
  const res = await (await fetch(process.env.SOLANA_TOKENS_LIST)).json();

  return res?.tokens?.filter(({ chainId }) => chainId === 101) || [];
};

export const TokenListContextProvider = ({
  children = null,
}: {
  children: JSX.Element | null;
}): JSX.Element => {
  const [tokensList, setTokensList] = useState<TokenInfo[]>([]);
  const [fraktionTokensList, setFraktionTokensList] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const solanaList = await getSolanaTokens();

        const fraktList =
          solanaList.filter(({ tags }) => tags?.includes('frakt-nft-pool')) ||
          [];

        setTokensList([...solanaList]);
        setFraktionTokensList(fraktList);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //? Token map for quick lookup.
  const tokensMap = useMemo(() => {
    const tokenMap = new Map();
    tokensList.forEach((token: TokenInfo) => {
      tokenMap.set(token.address, token);
    });
    return tokenMap;
  }, [tokensList]);

  //? Fraktion map for quick lookup.
  const fraktionTokensMap = useMemo(() => {
    const fraktionTokensMap = new Map();
    fraktionTokensList.forEach((token: TokenInfo) => {
      fraktionTokensMap.set(token.address, token);
    });

    if (fraktionTokensMap.size) {
      ADDITIONAL_SWAPPABLE_TOKENS_MINTS.forEach((mint) => {
        const token: TokenInfo = tokensMap.get(mint);
        if (token) {
          fraktionTokensMap.set(mint, tokensMap.get(mint));
        }
      });
    }

    return fraktionTokensMap;
  }, [fraktionTokensList, tokensMap]);

  return (
    <TokenListContext.Provider
      value={{
        tokensMap,
        loading,
        tokensList,
        fraktionTokensList,
        fraktionTokensMap,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
};
