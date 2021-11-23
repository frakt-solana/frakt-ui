import BN from 'bn.js';
import { RawUserTokensByMint } from '../UserTokens';

export interface PoolConfig {
  id: string;
  baseMint: string;
  quoteMint: string;
  lpMint: string;
  version: number;
  programId: string;
  authority: string;
  openOrders: string;
  targetOrders: string;
  baseVault: string;
  quoteVault: string;
  withdrawQueue: string;
  tempLpVault: string;
  marketVersion: number;
  marketProgramId: string;
  marketId: string;
  marketVaultSigner: string;
  marketBaseVault: string;
  marketQuoteVault: string;
  marketBids: string;
  marketAsks: string;
  marketEventQueue: string;
}

export interface SwapContextInterface {
  poolConfigs: PoolConfig[];
  fetchPoolInfo: (poolConfig: PoolConfig) => Promise<PoolInfo>;
  swap: (
    userTokensMap: RawUserTokensByMint,
    amount: BN,
    poolConfig: PoolConfig,
    isBuy: boolean,
  ) => Promise<void>;
  loading: boolean;
}

export interface SwapContextProviderProps {
  children: JSX.Element | JSX.Element[] | null;
}

export interface PoolInfo {
  status: BN;
  baseDecimals: number;
  quoteDecimals: number;
  lpDecimals: number;
  baseBalance: BN;
  quoteBalance: BN;
  lpSupply: BN;
}
