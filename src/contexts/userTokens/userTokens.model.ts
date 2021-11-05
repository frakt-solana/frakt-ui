import BN from 'bn.js';
import { TokenView } from 'solana-nft-metadata';

import { ArweaveMetadata } from '../../utils';

export interface UserToken {
  mint: string;
  metadata: ArweaveMetadata;
}

export interface TokensByMint {
  [key: string]: ArweaveMetadata;
}

export interface UserTokensInterface {
  tokens: UserToken[];
  tokensByMint: TokensByMint;
  loading: boolean;
  frktBalance: BN;
  updateFrktBalance: (userTokens: TokenView[]) => void;
}

export interface UseUserTokensInterface {
  tokens: UserToken[];
  tokensByMint: TokensByMint;
  loading: boolean;
}

export interface UseFrktBalanceInterface {
  balance: BN;
  updateBalance: (userTokens: TokenView[]) => void;
}
