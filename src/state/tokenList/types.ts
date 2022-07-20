import { TokenInfo } from '@frakt-protocol/frakt-sdk';

export type TokenListState = {
  tokensList: TokenInfo[];
  tokensMap: Map<string, TokenInfo>;
  fraktionTokensList: TokenInfo[];
  fraktionTokensMap: Map<string, TokenInfo>;
  loading: boolean;
};
