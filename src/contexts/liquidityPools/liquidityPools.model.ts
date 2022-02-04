import { LiquidityPoolKeysV4, TokenAmount } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { ReactNode } from 'react';
import {
  RouterData,
  StakeData,
  ConfigData,
} from '@frakters/fusion-pool/lib/borsh';

export interface LiquidityPoolsContextValues {
  loading: boolean;
  poolDataByMint: PoolDataByMint;
  programAccounts: any;
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
  harvestLiquidity: (
    params: HarvestLiquidityTransactionParams,
  ) => Promise<void>;
  stakeLiquidity: (params: HarvestLiquidityTransactionParams) => Promise<void>;
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
  fushionConfig?: ConfigData;
  router?: RouterData;
  fushionStakeAccounts?: StakeData;
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

export interface HarvestLiquidityTransactionParams {
  amount?: BN;
  router: RouterData;
  stakeAccount?: StakeData;
}

export interface ProgramAccountsData {
  fushionConfig: ConfigData;
  router: RouterData;
  fushionStakeAccounts: StakeData[];
}
