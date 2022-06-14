import { ReactNode } from 'react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { AccountInfo as TokenAccountInfo } from '@solana/spl-token';

export interface TokenAccount {
  pubkey: web3.PublicKey;
  account: web3.AccountInfo<Buffer>;
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
