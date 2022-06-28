import { Connection, PublicKey } from '@solana/web3.js';
import { Socket } from 'socket.io-client';

export interface NotificationState {
  config?: { mode: 'error' | 'warning'; content: JSX.Element };
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

export interface SolanaHealthState {
  health: SolanaNetworkHealth;
  loss: number;
}

export interface ConnectionState {
  connection: Connection;
}

export interface SocketState {
  socket: Socket;
}

export interface WalletState {
  wallet: {
    publicKey: PublicKey | null;
  };
}

export interface WalletModalState {
  isVisible: boolean;
}

export interface UserState {
  avatar: string;
  discordId: string;
  isOnServer: boolean;
}

export interface ModalState {
  isVisible: boolean;
}
