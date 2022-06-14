import { web3 } from '@frakt-protocol/frakt-sdk';

export interface NotificationPayload {
  config?: { mode: 'error' | 'warning'; content: JSX.Element };
  isVisible: boolean;
}
export interface WalletModalPayload {
  isVisible: boolean;
}
export interface SolanaHealthResponse {
  submitted: number;
  confirmed: number;
  loss: string;
  mean_ms: number;
  ts: string;
}

export enum SolanaNetworkHealth {
  Down = 'Down',
  Slow = 'Slow',
  Good = 'Good',
}

export interface ConnectionState {
  connection: web3.Connection;
}
