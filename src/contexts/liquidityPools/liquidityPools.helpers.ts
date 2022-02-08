import { getAllProgramAccounts } from '@frakters/fusion-pool';

import {
  CurrencyAmount,
  Liquidity,
  LiquidityPoolKeysV4,
  Spl,
  SPL_ACCOUNT_LAYOUT,
  Token,
  TokenAmount,
  WSOL,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { SOL_TOKEN } from '../../utils';

import { BLOCKED_POOLS_IDS } from './liquidityPools.constants';
import {
  FetchPoolDataByMint,
  PoolData,
  PoolDataByMint,
  ProgramAccountsData,
  RaydiumPoolInfo,
  RaydiumPoolInfoMap,
} from './liquidityPools.model';

const COINGECKO_URL = process.env.REACT_APP_COINGECKO_URL;

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
  const configs = await Liquidity.fetchAllPoolKeys(connection);

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

  const allPoolsInfo = await Promise.all(
    raydiumPoolConfigs.map((poolKey) =>
      Liquidity.fetchInfo({ connection, poolKeys: poolKey }),
    ),
  );

  allPoolsInfo.forEach((poolInfo, idx) => {
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

export const getTokenAccount = async ({
  tokenMint,
  owner,
  connection,
}: {
  tokenMint: PublicKey;
  owner: PublicKey;
  connection: Connection;
}): Promise<{
  pubkey: PublicKey;
  accountInfo: any;
} | null> => {
  const tokenAccountPubkey = await Spl.getAssociatedTokenAccount({
    mint: tokenMint,
    owner,
  });

  const tokenAccountEncoded = await connection.getAccountInfo(
    tokenAccountPubkey,
  );

  const tokenAccount = tokenAccountEncoded
    ? {
        pubkey: tokenAccountPubkey,
        accountInfo: SPL_ACCOUNT_LAYOUT.decode(tokenAccountEncoded.data),
      }
    : null;

  return tokenAccount;
};

export const getCurrencyAmount = (
  tokenInfo: TokenInfo,
  amount: BN,
): CurrencyAmount | TokenAmount => {
  return tokenInfo.address === SOL_TOKEN.address
    ? new CurrencyAmount(SOL_TOKEN, amount)
    : new TokenAmount(
        new Token(
          tokenInfo.address,
          tokenInfo.decimals,
          tokenInfo.symbol,
          tokenInfo.name,
        ),
        amount,
      );
};

export const fetchProgramAccounts = async ({
  vaultProgramId,
  connection,
}: {
  vaultProgramId: PublicKey;
  connection: Connection;
}): Promise<ProgramAccountsData> => {
  const allProgramAccounts = await getAllProgramAccounts(
    vaultProgramId,
    connection,
  );

  return allProgramAccounts;
};
