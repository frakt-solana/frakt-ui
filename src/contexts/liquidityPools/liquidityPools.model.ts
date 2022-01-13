import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';
import { ReactNode } from 'react';

export interface LiquidityPoolsContextValues {
  liquidityPools: any; //TODO: create
  loading: boolean;
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

export interface Pool {
  tokenInfo: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  poolInfo: RaydiumPoolInfo;
}
