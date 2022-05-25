export enum SolanaNetworkHealth {
  Down = 'Down',
  Slow = 'Slow',
  Good = 'Good',
}

export interface PingDataValues {
  loss: string;
}
export interface SolanaNetworkHealthValues {
  loss: number | null;
  health: SolanaNetworkHealth;
}
