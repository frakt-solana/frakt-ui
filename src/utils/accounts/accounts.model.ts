import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface AccountInfoData {
  owner: PublicKey;
  state: number;
  mint: PublicKey;
  amount: BN;
  delegateOption: number;
  delegate: PublicKey;
  isNativeOption: number;
  isNative: BN;
  delegatedAmount: BN;
  closeAuthorityOption: number;
  closeAuthority: PublicKey;
}

export interface AccountInfoParsed {
  publicKey: PublicKey;
  accountInfo: AccountInfoData;
}

export interface TokenView {
  tokenAccountPubkey: string;
  mint: string;
  owner: string;
  amount: number;
  amountBN: BN;
  delegateOption: boolean;
  delegate: string;
  state: number;
  isNativeOption: boolean;
  isNative: number;
  delegatedAmount: number;
  closeAuthorityOption: boolean;
  closeAuthority: string;
}
