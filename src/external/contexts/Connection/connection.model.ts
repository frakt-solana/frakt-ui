import { Connection } from '@solana/web3.js';
import { ENV as ChainID } from '@solana/spl-token-registry';

export interface ConnectionContextInterface {
  connection: Connection;
  endpoint: string;
  slippage: number;
  setSlippage: (val: number) => void;
  env: 'mainnet-beta' | 'devnet';
  chainId: ChainID;
}

export interface ConnectionProviderProps {
  children: JSX.Element | JSX.Element[] | null;
  endpoint?: string;
  isDev?: boolean;
}
