import { useContext } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { TokenListContextInterface } from './tokenList.model';
import { TokenListContext } from './tokenList.context';

export const useTokenListContext = (): TokenListContextInterface => {
  const context = useContext(TokenListContext);
  if (context === null) {
    throw new Error('Context not available');
  }
  return context;
};

export const useTokenMap = (): Map<string, TokenInfo> => {
  const { tokenMap } = useTokenListContext();
  return tokenMap;
};

// export const useSwappableTokens = () => {
//   const { swappableTokens } = useTokenListContext();
//   return { swappableTokens };
// };
