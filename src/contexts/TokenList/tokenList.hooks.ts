import { useContext } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { TokenListContextInterface } from './tokenList.model';
import { TokenListContext } from './tokenList.context';

export const useTokenListContext = (): TokenListContextInterface => {
  const context = useContext(TokenListContext);
  if (context === null) {
    throw new Error('TokenListContext not available');
  }
  return context;
};

export const useTokensMap = (): Map<string, TokenInfo> => {
  const { tokensMap } = useTokenListContext();
  return tokensMap;
};

export const useSwappableTokensMap = (): Map<string, TokenInfo> => {
  const { swappableTokensMap } = useTokenListContext();
  return swappableTokensMap;
};
