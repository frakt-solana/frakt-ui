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
import BN from 'bn.js';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAllProgramAccounts } from '@frakters/frkt-multiple-reward';
import {
  MainRouterView,
  SecondaryRewardView,
  SecondStakeAccountView,
  StakeAccountView,
} from '@frakters/frkt-multiple-reward/lib/accounts';

import { SOL_TOKEN } from '../../utils';
import { BLOCKED_POOLS_IDS, COINGECKO_URL } from './liquidityPools.constants';
import {
  FetchPoolDataByMint,
  PoolData,
  PoolDataByMint,
  FusionPoolsInfo,
  RaydiumPoolInfo,
  RaydiumPoolInfoMap,
  FusionPoolInfoByMint,
  FusionPoolInfo,
  secondaryRewardWithTokenInfo,
  LiquidityPoolKeysV4String,
  FusionPool,
} from './liquidityPools.model';

export const fetchPoolDataByMint: FetchPoolDataByMint = async ({
  tokensMap,
}) => {
  const allRaydiumConfigs = await fetchAllRaydiumPoolsConfigs();

  return getPoolDataByMint(allRaydiumConfigs, tokensMap);
};

const fetchAllRaydiumPoolsConfigs = async (): Promise<
  LiquidityPoolKeysV4[]
> => {
  // const configs = await Liquidity.fetchAllPoolKeys(connection);

  const rawConfigs: LiquidityPoolKeysV4String[] = await (
    await fetch(`${process.env.BFF_URL}/liquidity`)
  ).json();

  return (
    rawConfigs?.map((rawConfig) =>
      convertStringLiquidityPoolKeysV4ToPublicKeys(rawConfig),
    ) || []
  );
};

export const convertStringLiquidityPoolKeysV4ToPublicKeys = (
  rawPoolKeysV4: LiquidityPoolKeysV4String,
): LiquidityPoolKeysV4 => {
  return {
    authority: new PublicKey(rawPoolKeysV4.authority),
    baseMint: new PublicKey(rawPoolKeysV4.baseMint),
    baseVault: new PublicKey(rawPoolKeysV4.baseVault),
    id: new PublicKey(rawPoolKeysV4.id),
    lpMint: new PublicKey(rawPoolKeysV4.lpMint),
    lpVault: new PublicKey(rawPoolKeysV4.lpVault),
    marketAsks: new PublicKey(rawPoolKeysV4.marketAsks),
    marketAuthority: new PublicKey(rawPoolKeysV4.marketAuthority),
    marketBaseVault: new PublicKey(rawPoolKeysV4.marketBaseVault),
    marketBids: new PublicKey(rawPoolKeysV4.marketBids),
    marketEventQueue: new PublicKey(rawPoolKeysV4.marketEventQueue),
    marketId: new PublicKey(rawPoolKeysV4.marketId),
    marketProgramId: new PublicKey(rawPoolKeysV4.marketProgramId),
    marketQuoteVault: new PublicKey(rawPoolKeysV4.marketQuoteVault),
    marketVersion: rawPoolKeysV4.marketVersion,
    openOrders: new PublicKey(rawPoolKeysV4.openOrders),
    programId: new PublicKey(rawPoolKeysV4.programId),
    quoteMint: new PublicKey(rawPoolKeysV4.quoteMint),
    quoteVault: new PublicKey(rawPoolKeysV4.quoteVault),
    targetOrders: new PublicKey(rawPoolKeysV4.targetOrders),
    version: rawPoolKeysV4.version,
    withdrawQueue: new PublicKey(rawPoolKeysV4.withdrawQueue),
  };
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
}): Promise<FusionPoolsInfo> => {
  const allProgramAccounts = await getAllProgramAccounts(
    vaultProgramId,
    connection,
  );

  return allProgramAccounts;
};

const getFusionDataMap = (
  allProgramAccounts: FusionPoolsInfo,
  lpMints: string[],
  owner: string,
) => {
  const {
    secondaryRewards,
    stakeAccounts,
    mainRouters,
    secondaryStakeAccounts,
  } = allProgramAccounts;

  const getRouterByMint = (lpMint: string) => {
    return mainRouters.find(({ tokenMintInput }) => tokenMintInput === lpMint);
  };

  const routerInfoByMint = lpMints.reduce((routerInfoMap, lpMint) => {
    const router = getRouterByMint(lpMint);
    routerInfoMap.set(lpMint, router);
    return routerInfoMap;
  }, new Map<string, MainRouterView>());

  const secondaryRewardByMint = lpMints.reduce(
    (secondaryRewardInfoMap, lpMint) => {
      const router = getRouterByMint(lpMint);

      const secondaryReward = secondaryRewards.filter(
        ({ routerPubkey }) => routerPubkey === router?.mainRouterPubkey,
      );

      secondaryRewardInfoMap.set(lpMint, secondaryReward);
      return secondaryRewardInfoMap;
    },
    new Map<string, SecondaryRewardView[]>(),
  );

  const stakeAccountsByMint = lpMints.reduce((stakeAccountInfoMap, lpMint) => {
    const router = getRouterByMint(lpMint);

    const stakeAccount = stakeAccounts
      .filter(({ stakeOwner }) => stakeOwner === owner)
      .filter(({ routerPubkey }) => routerPubkey === router?.mainRouterPubkey)
      .find(({ isStaked }) => isStaked);

    stakeAccountInfoMap.set(lpMint, stakeAccount);
    return stakeAccountInfoMap;
  }, new Map<string, StakeAccountView>());

  const secondaryStakeAccountsByMint = lpMints.reduce(
    (secondaryStakeAccountInfoMap, lpMint) => {
      const secondaryStakeAccount = secondaryStakeAccounts
        .filter(({ rewardOwner }) => rewardOwner === owner)
        .find(
          ({ stakeAccount }) =>
            stakeAccount ===
            stakeAccountsByMint.get(lpMint)?.stakeAccountPubkey,
        );

      secondaryStakeAccountInfoMap.set(lpMint, secondaryStakeAccount);
      return secondaryStakeAccountInfoMap;
    },
    new Map<string, SecondStakeAccountView>(),
  );

  return {
    routerInfoByMint,
    secondaryRewardByMint,
    stakeAccountsByMint,
    secondaryStakeAccounts,
    secondaryStakeAccountsByMint,
  };
};

export const mapFusionPoolInfo = (
  allProgramAccounts: FusionPoolsInfo,
  lpMints: string[],
  owner: string,
): FusionPoolInfoByMint => {
  const {
    routerInfoByMint,
    secondaryRewardByMint,
    stakeAccountsByMint,
    secondaryStakeAccountsByMint,
  } = getFusionDataMap(allProgramAccounts, lpMints, owner);

  return lpMints.reduce((fusionPoolInfo, lpMint) => {
    if (routerInfoByMint.get(lpMint)) {
      fusionPoolInfo.set(lpMint, {
        mainRouter: routerInfoByMint.get(lpMint),
        stakeAccount: stakeAccountsByMint.get(lpMint),
        secondaryReward: secondaryRewardByMint.get(lpMint),
        secondaryStakeAccount: secondaryStakeAccountsByMint.get(lpMint),
      });
    }

    return fusionPoolInfo;
  }, new Map<string, FusionPoolInfo>());
};

export const getTokenInfoBySecondaryReward = (
  secondaryReward: SecondaryRewardView[],
  tokensList: TokenInfo[],
): secondaryRewardWithTokenInfo[] => {
  return secondaryReward.reduce((acc, reward) => {
    const tokenListSymbol = tokensList.filter(
      ({ address }) => address === reward.tokenMint,
    );
    acc.push({ ...reward, tokenInfo: tokenListSymbol });

    return acc;
  }, [] as secondaryRewardWithTokenInfo[]);
};

export const getTokenInfoByReward = (
  stakeAccount: StakeAccountView,
  tokensList: TokenInfo[],
): TokenInfo[] =>
  tokensList.filter(({ address }) => address === stakeAccount?.tokenMintOutput);

export const findSpecificFusionPool = (
  pools: FusionPool[] = [],
  inputTokenMint: string,
  outputTokenMint: string,
): FusionPool | null => {
  return (
    pools.find(
      ({ router }) =>
        router.tokenMintInput === inputTokenMint &&
        router.tokenMintOutput === outputTokenMint,
    ) || null
  );
};

//TODO const getFusionPoolsByWallet = (arr: FusionPool[], walletPubkey) => {}
