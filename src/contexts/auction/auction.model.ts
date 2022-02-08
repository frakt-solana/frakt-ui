import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { VaultData } from '../fraktion';

export interface WrapperActionTransactionParams {
  wallet: WalletContextState;
  connection: Connection;
}

export type WrapperActionTransactionType = 'wallet' | 'connection';

export interface BidOnAuctionParams extends WrapperActionTransactionParams {
  vaultInfo: VaultData;
  price: number;
}

export interface RedeemNftParams extends WrapperActionTransactionParams {
  vaultInfo: VaultData;
  safetyBoxOrder: number;
}

export interface RedeemRewardsFromAuctionSharesParams
  extends WrapperActionTransactionParams {
  vaultInfo: VaultData;
}

export interface StartFraktionalizerAuctionParams
  extends WrapperActionTransactionParams {
  vaultInfo: VaultData;
  price: number;
  isAuctionInitialized: boolean;
}

export interface RefundBidParams extends WrapperActionTransactionParams {
  vaultInfo: VaultData;
  bid: string;
}

export interface UnlockVaultParams extends WrapperActionTransactionParams {
  vaultInfo: VaultData;
}

export interface UnlockVaultAndRedeemNftsParams
  extends WrapperActionTransactionParams {
  vaultInfo: VaultData;
  patchVault: (vaultInfo: VaultData) => void;
}

export interface UnlockVaultAndRedeemNftsWrapParams
  extends WrapperActionTransactionParams {
  patchVault: (vaultInfo: VaultData) => void;
}

export type UnlockVaultAndRedeemNftsWrapType =
  | 'wallet'
  | 'connection'
  | 'patchVault';
