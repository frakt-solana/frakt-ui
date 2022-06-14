import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

export type WalletAndConnection = {
  connection: web3.Connection;
  wallet: WalletContextState;
};

export type WithoutWalletAndConnection<Type> = Omit<
  Type,
  keyof WalletAndConnection
>;
