import { TokenInfo } from '@solana/spl-token-registry';

export type TokenListContextInterface = {
  tokensList: TokenInfo[];
  tokensMap: Map<string, TokenInfo>;
  fraktionTokensList: TokenInfo[];
  fraktionTokensMap: Map<string, TokenInfo>;
  loading: boolean;
};
