import { useMemo } from 'react';
import { useTokenMap } from '../../../contexts/TokenList';
import { Token } from '../../../utils';

export const useTokenByMint = (mint: string): Token[] => {
  const tokensMap = useTokenMap();
  const token = tokensMap.get(mint);

  const tokenList = useMemo(() => {
    return [token].reduce((acc) => {
      return token
        ? [
            ...acc,
            {
              mint: token.address,
              symbol: token.symbol,
              img: token.logoURI,
              data: token,
            },
          ]
        : acc;
    }, []);
  }, [token]);
  return tokenList;
};
