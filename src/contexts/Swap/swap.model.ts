import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import BN from 'bn.js';
import { RawUserTokensByMint } from '../userTokens';

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
  poolConfigs: LiquidityPoolKeysV4[];
  fetchPoolInfo: (poolConfig: LiquidityPoolKeysV4) => Promise<PoolInfo>;
  swap: (
    userTokensMap: RawUserTokensByMint,
    amount: BN,
    minAmount: BN,
    poolConfig: LiquidityPoolKeysV4,
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
  baseReserve: BN;
  quoteReserve: BN;
  lpSupply: BN;
}
