import { TokenView } from 'solana-nft-metadata';

import { ArweaveMetadata } from '../../utils';

export interface UserNFT {
  mint: string;
  metadata: ArweaveMetadata;
}

export interface nftsByMint {
  [key: string]: ArweaveMetadata;
}

export interface RawUserTokensByMint {
  [mint: string]: TokenView;
}

export interface UserTokensInterface {
  nfts: UserNFT[];
  nftsByMint: nftsByMint;
  rawUserTokensByMint: RawUserTokensByMint;
  loading: boolean;
  refetch: () => Promise<void>;
  removeTokenOptimistic: (mints: string[]) => void;
}

export interface UseUserTokensInterface {
  nfts: UserNFT[];
  nftsByMint: nftsByMint;
  rawUserTokensByMint: RawUserTokensByMint;
  loading: boolean;
  refetch: () => Promise<void>;
  removeTokenOptimistic: (tokenMint: string[]) => void;
}
