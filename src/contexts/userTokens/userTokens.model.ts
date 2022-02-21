import { TokenView } from 'solana-nft-metadata';

import { ArweaveMetadata } from '../../utils';

export interface UserNFT {
  mint: string;
  metadata: ArweaveMetadata;
}

export interface RawUserTokensByMint {
  [mint: string]: TokenView;
}

export interface UserTokensValues {
  nfts: UserNFT[];
  rawUserTokensByMint: RawUserTokensByMint;
  loading: boolean;
  nftsLoading: boolean;
  fetchUserNfts: () => Promise<void>;
  refetch: () => Promise<void>;
  removeTokenOptimistic: (mints: string[]) => void;
}
