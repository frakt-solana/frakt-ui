import { TokenView } from '../../utils/accounts';

import {
  ArweaveAttribute,
  ArweaveMetadata,
} from '../../utils/getArweaveMetadata';

export interface BorrowNftsState {
  data: BorrowNFT[];
}

export interface BorrowNFT {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string;
  returnPeriodDays: number;
  ltvPercents: number;
  loanValue: string;
  fee: string;
  feeDiscountPercents: string;
  repayValue: string;
}

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
  allNfts: UserNFT[]; //? Includes frozen nfts
  rawUserTokensByMint: RawUserTokensByMint;
  loading: boolean;
  nftsLoading: boolean;
  fetchUserNfts: () => Promise<void>;
  refetch: () => Promise<void>;
  removeTokenOptimistic: (mints: string[]) => void;
}

interface QNFetchNFTDataCreators {
  address: string;
  share?: number;
  verified?: number;
}

export interface QNFetchNFTData {
  chain: string;
  collectionAddress: string;
  collectionName: string;
  creators: QNFetchNFTDataCreators[];
  description: string;
  imageUrl: string;
  name: string;
  network: string;
  provenance: unknown;
  tokenAddress: string;
  traits: ArweaveAttribute[];
}

export interface QNFetchResult {
  assets: QNFetchNFTData[];
  owner: string;
  pageNumber: number;
  totalItems: number;
  totalPages: number;
}

export interface QNFetchResponseData {
  id: number;
  jsonrpc: string;
  result: QNFetchResult;
}
