import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

export type WalletAndConnection = {
  connection: Connection;
  wallet: WalletContextState;
};

export type WithoutWalletAndConnection<Type> = Omit<
  Type,
  keyof WalletAndConnection
>;
