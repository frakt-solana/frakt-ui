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
  allowFurtherShareCreation: boolean;
  pricingLookupAddress: string;
  tokenTypeCount: number;
  state: VaultState;
  lockedPricePerShare: BN;
}

export interface SafetyBox {
  safetyBoxPubkey: string;
  key: VaultKey;
  vault: string;
  tokenMint: string;
  store: string;
  order: number;
}

export interface CreateFraktionalizerResult {
  vault: string;
  fractionalMint: string;
  redeemTreasury: string;
  fractionTreasury: string;
  instructions: TransactionInstruction[];
  signers: Keypair[];
}

export interface FetchVaultsResult {
  vaults: Vault[];
  safetyBoxes: SafetyBox[];
}

export type fraktionalizeFunction = (
  tokenMint: string,
  pricePerFraction: number,
  fractionsAmount: number,
  token: 'SOL' | 'FRKT',
) => Promise<CreateFraktionalizerResult | null>;

export type fetchVaultsFunction = () => Promise<FetchVaultsResult | null>;

export interface FraktionContextType {
  fraktionalize: fraktionalizeFunction;
}
