import { TokenInfo } from '@solana/spl-token-registry';

export type TokenListContextInterface = {
  tokenMap: Map<string, TokenInfo>;
  tokenList: TokenInfo[];
  swappableTokensList: TokenInfo[];
  swappableTokensMap: Map<string, TokenInfo>;
  loading: boolean;
};
