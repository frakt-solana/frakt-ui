import { Connection } from '@solana/web3.js';
import { Socket } from 'socket.io-client';

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
  connection: Connection;
}

export interface SocketState {
  socket: Socket;
}
