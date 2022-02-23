import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection } from '@solana/web3.js';
import BN from 'bn.js';
import { ReactNode } from 'react';

import {
  StakeLiquidityTransactionParams,
  UnstakeLiquidityTransactionParams,
} from './transactions/fusionPools';
import {
  AddLiquidityTransactionParams,
  RemoveLiquidityTransactionParams,
  SwapTransactionParams,
} from './transactions/raydiumLiquidityPools';
import {
  MainPoolConfigView,
  MainRouterView,
  SecondStakeAccountView,
  SecondaryRewardView,
  StakeAccountView,
} from '@frakters/frkt-multiple-reward/lib/accounts';

export interface LiquidityPoolsContextValues {
  loading: boolean;
  poolDataByMint: PoolDataByMint;
  fetchRaydiumPoolsInfo: (
    raydiumPoolConfigs: LiquidityPoolKeysV4[],
  ) => Promise<RaydiumPoolInfo[]>;
  raydiumSwap: (params: SwapTransactionParams) => Promise<void>;
  createRaydiumLiquidityPool: (params: any) => Promise<void>;
  addRaydiumLiquidity: (params: AddLiquidityTransactionParams) => Promise<void>;
  removeRaydiumLiquidity: (
    params: RemoveLiquidityTransactionParams,
  ) => Promise<void>;
  harvestLiquidity: (params: any) => Promise<void>;
  harvestSecondaryLiquidity: (params: any) => Promise<void>;
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

export type FusionPoolInfoByMint = Map<string, FusionPoolInfo>;

export interface PoolData {
  tokenInfo: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
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

export interface FusionPoolsInfo {
  mainPoolConfigs: MainPoolConfigView[];
  mainRouters: MainRouterView[];
  secondaryStakeAccounts: SecondStakeAccountView[];
  secondaryRewards: SecondaryRewardView[];
  stakeAccounts: StakeAccountView[];
}

export interface FusionPoolInfo {
  mainRouter: MainRouterView;
  stakeAccount: StakeAccountView[];
  secondaryReward: SecondaryRewardView[];
  secondaryStakeAccount: SecondStakeAccountView;
}
