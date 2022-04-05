import { TokenView } from 'solana-nft-metadata';

import {
  ArweaveAttribute,
  ArweaveMetadata,
} from '../../utils/getArweaveMetadata';

export interface UserNFT {
  mint: string;
  metadata: ArweaveMetadata;
}

export interface UserNFTWithCollection extends UserNFT {
  collectionName?: string;
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

export interface QNFetchNFTData {
  chain: string;
  collectionAddress: string;
  collectionName: string;
  creators: string[];
  description: string;
  imageUrl: string;
  name: string;
  network: string;
  provenance: unknown;
  tokenAddress: string;
  traits: ArweaveAttribute[];
}

export interface QNFetchResponseData {
  id: number;
  jsonrpc: string;
  result: {
    assets: QNFetchNFTData[];
    owner: string;
    pageNumber: number;
    totalItems: number;
    totalPages: number;
  };
}
