import { BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export type AnchorState = { [key: string]: unknown };

export type AnchorAccountBFF<T> = {
  publicKey: string;
  account: T;
};

//? CommunityPools types
export type RawCommunityPoolBFF = AnchorAccountBFF<{
  authority: string;
  createdAt: string;
  fractionMint: string;
  fractionsSupply: string;
  state: AnchorState;
  tokenProgram: string;
  tokenTypeCount: string;
}>;
export interface CommunityPool {
  publicKey: PublicKey;
  authority: PublicKey;
  createdAt: BN;
  fractionMint: PublicKey;
  fractionsSupply: BN;
  state: CommunityPoolState;
  tokenProgram: PublicKey;
  tokenTypeCount: BN;
}
export enum CommunityPoolState {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}

//? LotteryTickets types
export type RawLotteryTicketBFF = AnchorAccountBFF<{
  communityPool: string;
  lotteryTicketState: AnchorState;
  ticketHolder: string;
  winningSafetyBox: string;
}>;
export interface LotteryTicket {
  publicKey: PublicKey;
  communityPool: PublicKey;
  lotteryTicketState: LotteryTicketState;
  ticketHolder: PublicKey;
  winningSafetyBox: PublicKey;
}
export enum LotteryTicketState {
  USED = 'used',
}

//? PoolWhitelists types
export type RawPoolWhitelistBFF = AnchorAccountBFF<{
  communityPool: string;
  whitelistType: AnchorState;
  whitelistedAddress: string;
}>;
export interface PoolWhitelist {
  publicKey: PublicKey;
  communityPool: PublicKey;
  whitelistType: PoolWhitelistType;
  whitelistedAddress: PublicKey;
}
export enum PoolWhitelistType {
  EMPTY = 'empty',
}

//? SafetyDepositBoxes types
export type RawSafetyDepositBoxBFF = AnchorAccountBFF<{
  communityPool: string;
  nftMint: string;
  safetyBoxState: AnchorState;
  storeNftTokenAccount: string;
}>;
export interface SafetyDepositBox {
  publicKey: PublicKey;
  communityPool: PublicKey;
  nftMint: PublicKey;
  safetyBoxState: SafetyDepositBoxState;
  storeNftTokenAccount: PublicKey;
}
export enum SafetyDepositBoxState {
  EMPTY = 'empty',
  LOCKED = 'locked',
}
export interface SafetyDepositBoxWithNftMetadata extends SafetyDepositBox {
  nftAttributes: NftAttributes;
  nftCollectionName: string;
  nftDescription: string;
  nftImage: string;
  nftIsVerified: boolean;
  nftName: string;
}

//? NftMetadata types
export type NftAttributes = { trait_type: string; value: string | number }[];
export type RawNftMetadataBFF = {
  attributes: NftAttributes;
  collectionName: string;
  description: string;
  image: string;
  isVerified: boolean;
  mint: string;
  name: string;
};

//? NftPoolData types
export interface RawNftPoolDataBFF {
  communityPools: RawCommunityPoolBFF[];
  lotteryTickets: RawLotteryTicketBFF[];
  poolWhitelists: RawPoolWhitelistBFF[];
  safetyDepositBoxes: RawSafetyDepositBoxBFF[];
  nftsMetadata: RawNftMetadataBFF[];
}

export interface NftPoolData extends CommunityPool {
  lotteryTickets: LotteryTicket[];
  poolWhitelist: PoolWhitelist[];
  safetyBoxes: SafetyDepositBoxWithNftMetadata[];
}
