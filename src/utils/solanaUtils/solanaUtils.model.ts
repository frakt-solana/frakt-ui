import { ReactNode } from 'react';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { AccountInfo as TokenAccountInfo } from '@solana/spl-token';

export interface TokenAccount {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
  info: TokenAccountInfo;
}

export enum NotifyType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export interface NotifyOject {
  message: string;
  description?: string | ReactNode;
  type?: NotifyType;
}

export type Notify = (value: NotifyOject) => void;
