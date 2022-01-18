import { TokenInfo } from '@solana/spl-token-registry';
import { useTokensMap } from '../../../contexts/TokenList';

export const useTokenByMint = (mint: string): TokenInfo => {
  const tokensMap = useTokensMap();
  return tokensMap.get(mint);
};
