import { TokenInfo } from '@solana/spl-token-registry';

export type TokenListContextInterface = {
  tokenMap: Map<string, TokenInfo>;
  tokenList: TokenInfo[];
  loading: boolean;
};
