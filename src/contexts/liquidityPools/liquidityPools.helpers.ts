import {
  LiquidityPoolKeysV4,
  Spl,
  SPL_ACCOUNT_LAYOUT,
  WSOL,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAllProgramAccounts } from '@frakters/frkt-multiple-reward';
import {
  MainRouterView,
  SecondaryRewardView,
  SecondStakeAccountView,
  StakeAccountView,
} from '@frakters/frkt-multiple-reward/lib/accounts';

import { BLOCKED_POOLS_IDS } from './liquidityPools.constants';
import {
  PoolData,
  PoolDataByMint,
  FusionPoolsInfo,
  FusionPoolInfoByMint,
  FusionPoolInfo,
  secondaryRewardWithTokenInfo,
} from './liquidityPools.model';

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
