import { Liquidity, LiquidityPoolKeysV4, WSOL } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection } from '@solana/web3.js';
import { BLOCKED_POOLS_IDS, COINGECKO_URL } from './liquidityPools.constants';
import {
  FetchPoolDataByMint,
  PoolData,
  PoolDataByMint,
  RaydiumPoolInfo,
  RaydiumPoolInfoMap,
} from './liquidityPools.model';

export const fetchPoolDataByMint: FetchPoolDataByMint = async ({
  connection,
  tokensMap,
}) => {
  const allRaydiumConfigs = await fetchAllRaydiumPoolsConfigs(connection);

  return getPoolDataByMint(allRaydiumConfigs, tokensMap);
};

const fetchAllRaydiumPoolsConfigs = async (
  connection: Connection,
): Promise<LiquidityPoolKeysV4[]> => {
  const configs = await Liquidity.getPools(connection);

  return configs;
};

export const getPoolDataByMint = (
  raydiumPoolConfigs: LiquidityPoolKeysV4[],
  tokensMap: Map<string, TokenInfo>,
): PoolDataByMint =>
  raydiumPoolConfigs.reduce((acc, raydiumPoolConfig) => {
    const { id, baseMint, quoteMint } = raydiumPoolConfig;

    const tokenInfo = tokensMap.get(baseMint.toBase58());

    if (
      tokenInfo &&
      quoteMint.toBase58() === WSOL.mint &&
      !BLOCKED_POOLS_IDS.includes(id.toBase58())
    ) {
      acc.set(baseMint.toBase58(), {
        tokenInfo,
        poolConfig: raydiumPoolConfig,
        isAwarded: Math.random() < 0.5,
      });
    }

    return acc;
  }, new Map<string, PoolData>());

export const filterFraktionPoolConfigs = (
  raydiumPoolConfigs: LiquidityPoolKeysV4[],
  tokensMap: Map<string, TokenInfo>,
): LiquidityPoolKeysV4[] =>
  raydiumPoolConfigs.filter(({ id, baseMint, quoteMint }) => {
    return (
      tokensMap.has(baseMint.toBase58()) &&
      quoteMint.toBase58() === WSOL.mint &&
      !BLOCKED_POOLS_IDS.includes(id.toBase58())
    );
  });

export const fetchRaydiumPoolsInfoMap = async (
  connection: Connection,
  raydiumPoolConfigs: LiquidityPoolKeysV4[],
): Promise<RaydiumPoolInfoMap> => {
  const raydiumPoolInfoMap = new Map<string, RaydiumPoolInfo>();
  (
    await Liquidity.getMultipleInfo({
      connection,
      pools: raydiumPoolConfigs,
    })
  ).forEach((poolInfo, idx) => {
    raydiumPoolInfoMap.set(
      raydiumPoolConfigs?.[idx]?.baseMint.toBase58(),
      poolInfo,
    );
  });

  return raydiumPoolInfoMap;
};

export const fetchSolanaPriceUSD = async (): Promise<number> => {
  try {
    const result = await (
      await fetch(`${COINGECKO_URL}/simple/price?ids=solana&vs_currencies=usd`)
    ).json();

    return result?.solana?.usd || 0;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('coingecko api error: ', error);
    return 0;
  }
};
