import {
  LiquidityAssociatedPoolKeysV4,
  LiquidityPoolKeysV4,
  LiquiditySide,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import { ReactNode } from 'react';
import { Config, Router, Stake } from '@frakters/fusion-pool';

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
    params: HarvestLiquidityTransactionParams,
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

export interface SwapTransactionParams extends WrapperTransactionParams {
  baseToken: TokenInfo;
  baseAmount: BN;
  quoteToken: TokenInfo;
  quoteAmount: BN;
  poolConfig: LiquidityPoolKeysV4;
}

export interface AddLiquidityTransactionParams
  extends WrapperTransactionParams {
  baseToken: TokenInfo;
  baseAmount: BN;
  quoteToken: TokenInfo;
  quoteAmount: BN;
  poolConfig: LiquidityPoolKeysV4;
  fixedSide: LiquiditySide;
}

export type WrappedLiquidityTranscationParams =
  | 'connection'
  | 'walletPublicKey'
  | 'signTransaction';

export interface WrapperTransactionParams {
  connection?: Connection;
  walletPublicKey?: PublicKey;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
}

export interface CreateLiquidityTransactionParams
  extends WrapperTransactionParams {
  baseAmount: BN;
  quoteAmount: BN;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  marketId: PublicKey;
}

export interface RemoveLiquidityTransactionParams
  extends WrapperTransactionParams {
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

export interface HarvestLiquidityTransactionParams
  extends WrapperTransactionParams {
  router: Router;
  stakeAccount: Stake;
}

export interface StakeLiquidityTransactionParams
  extends WrapperTransactionParams {
  router: Router;
  amount: BN;
}

export interface createEmptyRaydiumLiquidityParams
  extends WrapperTransactionParams {
  associatedPoolKeys?: LiquidityAssociatedPoolKeysV4;
}

export interface InitRaydiumLiquidityParams extends WrapperTransactionParams {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseAmount: BN;
  quoteAmount: BN;
  associatedPoolKeys: LiquidityAssociatedPoolKeysV4;
}
