import {
  web3,
  pools,
  raydium,
  BN,
  TokenInfo,
  MainRouterView,
  SecondaryRewardView,
  SecondStakeAccountView,
  StakeAccountView,
} from '@frakt-protocol/frakt-sdk';
import { groupBy } from 'lodash';

import { SOL_TOKEN } from '../../utils';
import { BLOCKED_POOLS_IDS } from './liquidityPools.constants';
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
  FusionPool,
} from './liquidityPools.model';
import { Cacher } from '../../utils/cacher';

export const fetchPoolDataByMint: FetchPoolDataByMint = async ({
  tokensMap,
}) => {
  const allRaydiumConfigs = await Cacher.getAllRaydiumPoolsConfigs();

  return getPoolDataByMint(allRaydiumConfigs, tokensMap);
};

export const getPoolDataByMint = (
  raydiumPoolConfigs: raydium.LiquidityPoolKeysV4[],
  tokensMap: Map<string, TokenInfo>,
): PoolDataByMint =>
  raydiumPoolConfigs.reduce((acc, raydiumPoolConfig) => {
    const { id, baseMint, quoteMint } = raydiumPoolConfig;

    const tokenInfo = tokensMap.get(baseMint.toBase58());

    if (
      tokenInfo &&
      quoteMint.toBase58() === raydium.WSOL.mint &&
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
  raydiumPoolConfigs: raydium.LiquidityPoolKeysV4[],
  tokensMap: Map<string, TokenInfo>,
): raydium.LiquidityPoolKeysV4[] =>
  raydiumPoolConfigs.filter(({ id, baseMint, quoteMint }) => {
    return (
      tokensMap.has(baseMint.toBase58()) &&
      quoteMint.toBase58() === raydium.WSOL.mint &&
      !BLOCKED_POOLS_IDS.includes(id.toBase58())
    );
  });

export const fetchRaydiumPoolsInfoMap = async (
  connection: web3.Connection,
  raydiumPoolConfigs: raydium.LiquidityPoolKeysV4[],
): Promise<RaydiumPoolInfoMap> => {
  const raydiumPoolInfoMap = new Map<string, RaydiumPoolInfo>();

  const allPoolsInfo = await Promise.all(
    raydiumPoolConfigs.map((poolKey) =>
      raydium.Liquidity.fetchInfo({ connection, poolKeys: poolKey }),
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

export const getTokenAccount = async ({
  tokenMint,
  owner,
  connection,
}: {
  tokenMint: web3.PublicKey;
  owner: web3.PublicKey;
  connection: web3.Connection;
}): Promise<{
  pubkey: web3.PublicKey;
  accountInfo: any;
} | null> => {
  const tokenAccountPubkey = await raydium.Spl.getAssociatedTokenAccount({
    mint: tokenMint,
    owner,
  });

  const tokenAccountEncoded = await connection.getAccountInfo(
    tokenAccountPubkey,
  );

  const tokenAccount = tokenAccountEncoded
    ? {
        pubkey: tokenAccountPubkey,
        accountInfo: raydium.SPL_ACCOUNT_LAYOUT.decode(
          tokenAccountEncoded.data,
        ),
      }
    : null;

  return tokenAccount;
};

export const getCurrencyAmount = (
  tokenInfo: TokenInfo,
  amount: BN,
): raydium.CurrencyAmount | raydium.TokenAmount => {
  return tokenInfo.address === SOL_TOKEN.address
    ? new raydium.CurrencyAmount(SOL_TOKEN, amount)
    : new raydium.TokenAmount(
        new raydium.Token(
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
  vaultProgramId: web3.PublicKey;
  connection: web3.Connection;
}): Promise<FusionPoolsInfo> => {
  const allProgramAccounts = await pools.getAllProgramStakingAccounts(
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

export const mapRawPools = ({
  mainRouters,
  stakeAccounts,
  secondaryRewards,
  secondaryStakeAccounts,
}: {
  mainRouters: MainRouterView[];
  stakeAccounts: StakeAccountView[];
  secondaryRewards: SecondaryRewardView[];
  secondaryStakeAccounts: SecondStakeAccountView[];
}): FusionPool[] => {
  const stakeAccountsByRouterPubkey = groupBy(stakeAccounts, 'routerPubkey');

  const secondaryRewardsByRouterPubkey = groupBy(
    secondaryRewards,
    'routerPubkey',
  );
  const secondaryStakeAccountsBySecondaryRewardAccountPubkey = groupBy(
    secondaryStakeAccounts,
    'secondaryReward',
  );

  const fusionPools: FusionPool[] = mainRouters.map((router) => {
    const stakeAccounts =
      stakeAccountsByRouterPubkey[router.mainRouterPubkey] || [];

    const secondaryRewards = (
      secondaryRewardsByRouterPubkey[router.mainRouterPubkey] || []
    )?.map((rewards: SecondaryRewardView) => {
      return {
        rewards,
        stakeAccounts:
          secondaryStakeAccountsBySecondaryRewardAccountPubkey[
            rewards?.secondaryRewardaccount
          ] || [],
      };
    });

    return {
      router,
      stakeAccounts,
      secondaryRewards,
    };
  });

  return fusionPools;
};
