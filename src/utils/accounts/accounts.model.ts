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
