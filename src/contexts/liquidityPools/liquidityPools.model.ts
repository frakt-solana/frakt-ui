import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection } from '@solana/web3.js';
import BN from 'bn.js';
import { ReactNode } from 'react';
import { Config, Router, Stake } from '@frakters/fusion-pool';

import {
  HarvestLiquidityTransactionParams,
  StakeLiquidityTransactionParams,
  UnstakeLiquidityTransactionParams,
} from './transactions/fusionPools';
import {
  AddLiquidityTransactionParams,
  CreateLiquidityTransactionParams,
  RemoveLiquidityTransactionParams,
  SwapTransactionParams,
} from './transactions/raydiumLiquidityPools';

export interface LiquidityPoolsContextValues {
  loading: boolean;
  poolDataByMint: PoolDataByMint;
  fetchRaydiumPoolsInfo: (
    raydiumPoolConfigs: LiquidityPoolKeysV4[],
  ) => Promise<RaydiumPoolInfo[]>;
  raydiumSwap: (params: SwapTransactionParams) => Promise<void>;
  createRaydiumLiquidityPool: (
    params: CreateLiquidityTransactionParams,
  ) => Promise<void>;
  addRaydiumLiquidity: (params: AddLiquidityTransactionParams) => Promise<void>;
  removeRaydiumLiquidity: (
    params: RemoveLiquidityTransactionParams,
  ) => Promise<void>;
  harvestLiquidity: (
    params: HarvestLiquidityTransactionParams,
  ) => Promise<void>;
  stakeLiquidity: (params: StakeLiquidityTransactionParams) => Promise<void>;
  unstakeLiquidity: (
    params: UnstakeLiquidityTransactionParams,
  ) => Promise<void>;
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
