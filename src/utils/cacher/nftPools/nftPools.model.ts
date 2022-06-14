import { BN, web3 } from '@frakt-protocol/frakt-sdk';

export type AnchorState = { [key: string]: unknown };

export type AnchorAccountBFF<T> = {
  publicKey: string;
  account: T;
};

//? CommunityPools types
export type RawCommunityPool = AnchorAccountBFF<{
  authority: string;
  createdAt: string;
  fractionMint: string;
  fractionsSupply: string;
  state: AnchorState;
  tokenProgram: string;
  tokenTypeCount: string;
}>;
export interface CommunityPool {
  publicKey: web3.PublicKey;
  authority: web3.PublicKey;
  createdAt: BN;
  fractionMint: web3.PublicKey;
  fractionsSupply: BN;
  state: CommunityPoolState;
  tokenProgram: web3.PublicKey;
  tokenTypeCount: BN;
  customName?: string;
}
export enum CommunityPoolState {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}

//? LotteryTickets types
export type RawLotteryTicket = AnchorAccountBFF<{
  communityPool: string;
  lotteryTicketState: AnchorState;
  ticketHolder: string;
  winningSafetyBox: string;
}>;
export interface LotteryTicket {
  publicKey: web3.PublicKey;
  communityPool: web3.PublicKey;
  lotteryTicketState: LotteryTicketState;
  ticketHolder: web3.PublicKey;
  winningSafetyBox: web3.PublicKey;
}
export enum LotteryTicketState {
  USED = 'used',
  REVEALED = 'revealed',
  TO_BE_REVEALED = 'toBeRevealed',
}

//? PoolWhitelists types
export type RawPoolWhitelist = AnchorAccountBFF<{
  communityPool: string;
  whitelistType: AnchorState;
  whitelistedAddress: string;
}>;
export interface PoolWhitelist {
  publicKey: web3.PublicKey;
  communityPool: web3.PublicKey;
  whitelistType: PoolWhitelistType;
  whitelistedAddress: web3.PublicKey;
}
export enum PoolWhitelistType {
  SINGLE_NFT_WHITELIST = 'singleNftWhitelist',
  CREATOR_WHITELIST = 'creatorWhitelist',
}

//? SafetyDepositBoxes types
export type RawSafetyDepositBox = AnchorAccountBFF<{
  communityPool: string;
  nftMint: string;
  safetyBoxState: AnchorState;
  storeNftTokenAccount: string;
}>;
export interface SafetyDepositBox {
  publicKey: web3.PublicKey;
  communityPool: web3.PublicKey;
  nftMint: web3.PublicKey;
  safetyBoxState: SafetyDepositBoxState;
  storeNftTokenAccount: web3.PublicKey;
}
export enum SafetyDepositBoxState {
  EMPTY = 'empty',
  LOCKED = 'locked',
  TO_BE_WITHDRAWN = 'toBeWithdrawn',
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
export type RawNftMetadata = {
  attributes: NftAttributes;
  collectionName: string;
  description: string;
  image: string;
  isVerified: boolean;
  mint: string;
  name: string;
};

//? NftPoolData types
export interface RawNftPoolData {
  communityPools: RawCommunityPool[];
  lotteryTickets: RawLotteryTicket[];
  poolWhitelists: RawPoolWhitelist[];
  safetyDepositBoxes: RawSafetyDepositBox[];
  nftsMetadata: RawNftMetadata[];
}

export interface NftPoolData extends CommunityPool {
  lotteryTickets: LotteryTicket[];
  poolWhitelist: PoolWhitelist[];
  safetyBoxes: SafetyDepositBoxWithNftMetadata[];
}
