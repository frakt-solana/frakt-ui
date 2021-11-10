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
    Promise.all([
      fetch(
        'https://raw.githubusercontent.com/frakt-solana/fraktion-tokens-list/main/tokens.json',
      ).then((r) => r.json()),
      new TokenListProvider().resolve().then((tokens) => {
        const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
        return tokenList;
      }),
    ])
      .then((lists) => {
        setTokens([...lists[0], ...lists[1]]);
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
