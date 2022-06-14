import {
  raydium,
  MainPoolConfigView,
  MainRouterView,
  SecondStakeAccountView,
  SecondaryRewardView,
  StakeAccountView,
  BN,
} from '@frakt-protocol/frakt-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
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

export interface LiquidityPoolsContextValues {
  loading: boolean;
  poolDataByMint: PoolDataByMint;
  fetchRaydiumPoolsInfo: (
    raydiumPoolConfigs: raydium.LiquidityPoolKeysV4[],
  ) => Promise<RaydiumPoolInfo[]>;
  raydiumSwap: (params: SwapTransactionParams) => Promise<boolean | void>;
  createRaydiumLiquidityPool: (params: any) => Promise<void>;
  addRaydiumLiquidity: (
    params: AddLiquidityTransactionParams,
  ) => Promise<boolean | null>;
  removeRaydiumLiquidity: (
    params: RemoveLiquidityTransactionParams,
  ) => Promise<boolean>;
  harvestLiquidity: (params: any) => Promise<void>;
  stakeLiquidity: (params: StakeLiquidityTransactionParams) => Promise<boolean>;
  unstakeLiquidity: (
    params: UnstakeLiquidityTransactionParams,
  ) => Promise<boolean | null>;
}

export type LiquidityPoolsProviderType = ({
  children,
}: {
  children: ReactNode;
}) => JSX.Element;

export type RaydiumPoolInfoMap = Map<string, RaydiumPoolInfo>;

export type PoolDataByMint = Map<string, PoolData>;

export type FusionPoolInfoByMint = Map<string, FusionPoolInfo>;

export interface PoolData {
  tokenInfo: TokenInfo;
  poolConfig: raydium.LiquidityPoolKeysV4;
}

export type FetchPoolDataByMint = ({
  tokensMap,
}: {
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
  stakeAccount: StakeAccountView;
  secondaryReward: SecondaryRewardView[];
  secondaryStakeAccount: SecondStakeAccountView;
}

export interface secondaryRewardWithTokenInfo extends SecondaryRewardView {
  tokenInfo: TokenInfo[];
}

export interface FusionPool {
  router: MainRouterView;
  stakeAccounts: StakeAccountView[];
  secondaryRewards: {
    rewards: SecondaryRewardView;
    stakeAccounts: SecondStakeAccountView[];
  }[];
}
