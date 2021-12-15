import { TokenInfo } from '@solana/spl-token-registry';

export type TokenListContextInterface = {
  tokenList: TokenInfo[];
  tokenMap: Map<string, TokenInfo>;
  swappableTokensMap: Map<string, TokenInfo>;
  fraktionTokensList: TokenInfo[];
  fraktionTokensMap: Map<string, TokenInfo>;
  loading: boolean;
};
