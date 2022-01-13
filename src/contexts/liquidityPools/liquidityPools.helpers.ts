import { Liquidity, LiquidityPoolKeysV4, WSOL } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection } from '@solana/web3.js';
import { BLOCKED_POOLS_IDS } from './liquidityPools.constants';
import {
  Pool,
  RaydiumPoolInfo,
  RaydiumPoolInfoMap,
} from './liquidityPools.model';

export const fetchRaydiumPoolsConfigs = async (
  connection: Connection,
): Promise<LiquidityPoolKeysV4[]> => {
  const configs = await Liquidity.getPools(connection);

  return configs;
};

export const fetchRaydiumPoolsInfoMap = async (
  connection: Connection,
  poolConfigs: LiquidityPoolKeysV4[],
): Promise<RaydiumPoolInfoMap> => {
  const raydiumPoolInfoMap = new Map<string, RaydiumPoolInfo>();

  (
    await Liquidity.getMultipleInfo({
      connection,
      pools: poolConfigs,
    })
  ).forEach((poolInfo, idx) => {
    raydiumPoolInfoMap.set(poolConfigs?.[idx]?.baseMint.toBase58(), poolInfo);
  });

  return raydiumPoolInfoMap;
};

export const getFraktionPoolConfigs = (
  poolConfigs: LiquidityPoolKeysV4[],
  fraktionTokensMap: Map<string, TokenInfo>,
): LiquidityPoolKeysV4[] =>
  poolConfigs.filter(({ id, baseMint, quoteMint }) => {
    return (
      fraktionTokensMap.has(baseMint.toBase58()) &&
      quoteMint.toBase58() === WSOL.mint &&
      !BLOCKED_POOLS_IDS.includes(id.toBase58())
    );
  });

export const getPools = (
  poolConfigs: LiquidityPoolKeysV4[],
  poolsInfoMap: RaydiumPoolInfoMap,
  fraktionTokensMap: Map<string, TokenInfo>,
): Pool[] =>
  poolConfigs.map((poolConfig) => {
    return {
      tokenInfo: fraktionTokensMap.get(poolConfig.baseMint.toBase58()),
      poolConfig: poolConfig,
      poolInfo: poolsInfoMap.get(poolConfig.baseMint.toBase58()),
    };
  });
