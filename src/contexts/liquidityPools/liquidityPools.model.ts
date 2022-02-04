import { LiquidityPoolKeysV4, TokenAmount } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { ReactNode } from 'react';
import { Config, Router, Stake } from '@frakters/fusion-pool';

export interface LiquidityPoolsContextValues {
  loading: boolean;
  poolDataByMint: PoolDataByMint;
  programAccounts: ProgramAccountsData;
  fetchRaydiumPoolsInfo: (
    raydiumPoolConfigs: LiquidityPoolKeysV4[],
  ) => Promise<RaydiumPoolInfo[]>;
  raydiumSwap: (params: LiquidityTransactionParams) => Promise<void>;
  createRaydiumLiquidityPool: (
    params: CreateLiquidityTransactionParams,
  ) => Promise<void>;
  addRaydiumLiquidity: (params: LiquidityTransactionParams) => Promise<void>;
  removeRaydiumLiquidity: (
    params: RemoveLiquidityTransactionParams,
  ) => Promise<void>;
  harvestLiquidity: (params) => Promise<void>;
  stakeLiquidity: (params) => Promise<void>;
  unstakeLiquidity: (params) => Promise<void>;
}

export type LiquidityPoolsProviderType = ({
  children,
}: {
  children: ReactNode;
}) => JSX.Element;

export interface RaydiumPoolInfo {
  status: BN;
  baseDecimals: number;
  quoteDecimals: number;
  lpDecimals: number;
  baseReserve: BN;
  quoteReserve: BN;
  lpSupply: BN;
}

export type RaydiumPoolInfoMap = Map<string, RaydiumPoolInfo>;

export type PoolDataByMint = Map<string, PoolData>;

export interface PoolData {
  tokenInfo: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  fushionConfig?: Config;
  router?: Router;
  fushionStakeAccounts?: Stake;
}

export type FetchPoolDataByMint = ({
  connection,
  tokensMap,
}: {
  connection: Connection;
  tokensMap: Map<string, TokenInfo>;
}) => Promise<PoolDataByMint>;

export interface RaydiumPoolInfo {
  status: BN;
  baseDecimals: number;
  quoteDecimals: number;
  lpDecimals: number;
  baseReserve: BN;
  quoteReserve: BN;
  lpSupply: BN;
}

export interface LiquidityTransactionParams {
  baseToken: TokenInfo;
  baseAmount: BN;
  quoteToken: TokenInfo;
  quoteAmount: BN;
  poolConfig: LiquidityPoolKeysV4;
}

export interface CreateLiquidityTransactionParams {
  baseAmount: BN;
  quoteAmount: BN;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  marketId: PublicKey;
}

export interface RemoveLiquidityTransactionParams {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  amount: TokenAmount;
}

export interface ProgramAccountsData {
  configs: Config[];
  routers: Router[];
  stakeAccounts: Stake[];
}

export interface ProgramAccountData {
  config?: Config;
  router: Router;
  stakeAccount: Stake;
}
