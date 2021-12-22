import { RawUserTokensByMint, UserNFT } from '../userTokens';
import { Keypair, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';

export enum VaultState {
  Unfinished = 0,
  Auction = 1,
  Bought = 2,
  Closed = 3,
  AuctionLive = 4,
}

export interface RawVault {
  vaultPubkey: string;
  key: number;
  tokenProgram: string;
  fractionMint: string;
  authority: string;
  fractionTreasury: string;
  redeemTreasury: string;
  priceMint: string;
  allowFurtherShareCreation: number;
  pricingLookupAddress: string;
  tokenTypeCount: string;
  state: number;
  fractionsSupply: string;
  lockedPricePerShare: string;
  createdAt: string;
}

export interface Vault {
  vaultPubkey: string;
  key: number;
  tokenProgram: string;
  fractionMint: string;
  authority: string;
  fractionTreasury: string;
  redeemTreasury: string;
  priceMint: string;
  allowFurtherShareCreation: boolean;
  pricingLookupAddress: string;
  tokenTypeCount: string;
  state: VaultState;
  fractionsSupply: BN;
  lockedPricePerShare: BN;
  createdAt: number;
}

export interface RawAuction {
  auctionPubkey: string;
  current_winning_bid: string;
  end_auction_gap: string;
  ending_at: string;
  gap_tick_size_percentage: number;
  instant_sale_price: string;
  is_enabled: number;
  is_started: number;
  key: number;
  min_tick_size: string;
  started_at: string;
  total_uncancelled_bids: string;
  vault: string;
  version: string;
}

export interface Auction {
  auctionPubkey: string;
  vaultPubKey: string;
  currentWinningBidPubkey: string;
  startedAt: number | null;
  endingAt: number | null;
  isEnabled: boolean;
  isStarted: boolean;
  tickSize: BN; // bidPerShare * amountOfShares
}

export interface RawBid {
  auction: string;
  bidPubkey: string;
  bid_amount_per_share: string;
  bidder: string;
  is_canceled: number;
  key: number;
  placed_at: string;
  version: string;
}

export interface Bid {
  bidPubkey: string;
  auctionPubkey: string;
  bidAmountPerShare: BN;
  bidder: string;
  isCanceled: boolean;
  placedAt: number;
}

export interface VaultsMap {
  [key: string]: Vault;
}

export interface RawSafetyBox {
  key: number;
  order: string;
  safetyBoxPubkey: string;
  store: string;
  tokenMint: string;
  vault: string;
}

export interface SafetyBox {
  safetyBoxPubkey: string;
  vaultPubkey: string;
  key: number;
  nftMint: string;
  store: string;
  order: number;
}

export interface SafetyBoxWithMetadata extends SafetyBox, NftMetadata {}

export type NftAttributes = { trait_type: string; value: string | number }[];

export interface RawNftMetadata {
  mintAddress: string;
  fetchedMeta: {
    name: string;
    image: string;
    description: string;
    attributes: NftAttributes;
  };
  isVerifiedStatus: {
    collection?: string;
    success?: true;
    error?: true;
  };
}

export interface NftMetadata {
  nftName: string;
  nftDescription: string;
  nftImage: string;
  nftAttributes: NftAttributes;
  isNftVerified: boolean;
  nftCollectionName: string;
}

export interface VaultData extends Vault {
  hasMarket: boolean;
  safetyBoxes: SafetyBoxWithMetadata[];
  auction: {
    auction: Auction | null;
    bids: Bid[] | [];
  };
}

export interface Market {
  address: string;
  baseMint: string;
  programId: string;
}

export interface CreateFraktionalizerResult {
  vault: string;
  fractionalMint: string;
  redeemTreasury: string;
  fractionTreasury: string;
  instructions: TransactionInstruction[];
  signers: Keypair[];
}

export type fraktionalizeFunction = (
  userNft: UserNFT,
  tickerName: string,
  pricePerFraction: number,
  fractionsAmount: number,
  token: 'SOL' | 'FRKT',
) => Promise<CreateFraktionalizerResult | null>;

export type buyoutFunction = (
  vault: VaultData,
  userTokensByMint: RawUserTokensByMint,
) => Promise<{
  instructions: TransactionInstruction[];
  signers: Keypair[];
} | null>;

export type redeemFunction = (vault: VaultData) => Promise<{
  instructions: TransactionInstruction[];
  signers: Keypair[];
} | null>;

export type createFraktionsMarketFunction = (
  fractionsMintAddress: string,
  tickerName: string,
) => Promise<boolean>;

export type fetchDataFunction = () => Promise<void>;

export type patchVaultFunction = (vaultInfo: VaultData) => void;

export interface FraktionContextType {
  loading: boolean;
  error: any;
  vaults: VaultData[];
  vaultsMarkets: Market[];
  fraktionalize: fraktionalizeFunction;
  buyout: buyoutFunction;
  redeem: redeemFunction;
  createFraktionsMarket: createFraktionsMarketFunction;
  refetch: fetchDataFunction;
  patchVault: patchVaultFunction;
}
