import { Keypair, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';

export enum VaultKey {
  Uninitialized = 0,
  VaultV1 = 3,
  SafetyDepositBoxV1 = 1,
  ExternalPriceAccountV1 = 2,
}

export enum VaultState {
  Inactive = 0,
  Active = 1,
  Combined = 2,
  Deactivated = 3,
}

export interface Vault {
  vaultPubkey: string;
  key: VaultKey;
  tokenProgram: string;
  fractionMint: string;
  authority: string;
  fractionTreasury: string;
  redeemTreasury: string;
  priceMint: string;
  allowFurtherShareCreation: boolean;
  pricingLookupAddress: string;
  tokenTypeCount: number;
  state: VaultState;
  lockedPricePerShare: BN;
  fractionsSupply: BN;
}

export interface VaultsMap {
  [key: string]: Vault;
}

export interface SafetyBox {
  safetyBoxPubkey: string;
  key: VaultKey;
  vault: string;
  tokenMint: string;
  store: string;
  order: number;
}

export interface VaultData {
  fractionMint: string; // mint address of fractions
  authority: string; // who did the fraktionalization
  supply: BN; // amount of fractions
  lockedPricePerFraction: BN; // price per share that was initialized on fraktionalization
  priceTokenMint: string; // mint address of SOL or FRKT token
  publicKey: string; // vault public key
  state: string;
  nftMint: string; // mint address of fraktionalized NFT
  name: string; // name of fraktionalized NFT
  imageSrc: string; // image source of fraktionalized NFT
  nftAttributes: { trait_type: string; value: string | number }[];
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
  tokenMint: string,
  pricePerFraction: number,
  fractionsAmount: number,
  token: 'SOL' | 'FRKT',
) => Promise<CreateFraktionalizerResult | null>;

export type fetchVaultsFunction = () => Promise<VaultData[] | null>;

export interface FraktionContextType {
  loading: boolean;
  error: any;
  vaults: VaultData[];
  fraktionalize: fraktionalizeFunction;
  refetch: fetchVaultsFunction;
}
