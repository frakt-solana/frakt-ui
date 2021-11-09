import { useEffect, useState } from 'react';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';

export const useSolanaTokenList = (): {
  loading: boolean;
  tokens: TokenInfo[];
  isTickerAvailable: (ticker: string) => boolean;
} => {
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

  return { loading, tokens, isTickerAvailable };
};
