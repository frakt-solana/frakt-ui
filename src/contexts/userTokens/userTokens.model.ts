import { TokenView } from 'solana-nft-metadata';

export interface ArweaveAttribute {
  trait_type: string;
  value: number | string;
}

export interface ArweaveMetadata {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points?: number;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: ArweaveAttribute[];
  properties: any;
}

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
  frktBalance: number;
  updateFrktBalance: (userTokens: TokenView[]) => void;
}

export interface UseUserTokensInterface {
  tokens: UserToken[];
  tokensByMint: TokensByMint;
  loading: boolean;
}

export interface UseFrktBalanceInterface {
  balance: number;
  updateBalance: (userTokens: TokenView[]) => void;
}
