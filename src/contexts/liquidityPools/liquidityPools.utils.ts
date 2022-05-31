import BN, { max, min } from 'bn.js';
import {
  MainRouterView,
  SecondaryRewardView,
  SecondStakeAccountView,
  StakeAccountView,
} from '@frakters/frkt-multiple-reward/lib/accounts';

import { PoolStats } from '../../pages/PoolsPage';
import { FusionPoolInfo, RaydiumPoolInfo } from './liquidityPools.model';

export const calculateTVL = (
  poolInfo: RaydiumPoolInfo,
  currentSolanaPriceUSD: number,
): string | number => {
  if (poolInfo) {
    const { baseDecimals, baseReserve, quoteDecimals, quoteReserve } = poolInfo;

    const baseTokenAmount: number = baseReserve.toNumber() / 10 ** baseDecimals;
    const quoteTokenAmount: number =
      quoteReserve.toNumber() / 10 ** quoteDecimals;

    const allBaseTokenPriceUSD: number =
      (quoteTokenAmount / baseTokenAmount) * currentSolanaPriceUSD;

    const allQuoteTokenPriceUSD: number =
      quoteTokenAmount * currentSolanaPriceUSD;

    return formatNumberWithSpaceSeparator(
      allBaseTokenPriceUSD * allQuoteTokenPriceUSD,
    );
  }
};

export const calculateAPR = (
  raydiumPoolInfo: RaydiumPoolInfo,
  currentSolanaPriceUSD: number,
): string => {
  const totalLiquidity = formatTotalToNumber(
    calculateTVL(raydiumPoolInfo, currentSolanaPriceUSD),
  );

  const apr = formatNumberToPercent(totalLiquidity * 0.00012);
  return apr;
};

export const compareNumbers = (
  numberA = 0,
  numberB = 0,
  desc = true,
): number => {
  if (desc) {
    if (numberA > numberB) return -1;
  } else if (numberB > numberA) return -1;
};

export const comparePoolsArraysByTotal = (
  poolInfoA: RaydiumPoolInfo,
  poolInfoB: RaydiumPoolInfo,
  currentSolanaPriceUSD: number,
  desc = true,
): number => {
  const numberA: number = formatTotalToNumber(
    calculateTVL(poolInfoA, currentSolanaPriceUSD),
  );
  const numberB: number = formatTotalToNumber(
    calculateTVL(poolInfoB, currentSolanaPriceUSD),
  );

  if (desc) {
    if (numberA > numberB) return -1;
  } else if (numberB > numberA) return -1;
};

export const comparePoolsArraysByApr = (
  poolInfoA: RaydiumPoolInfo,
  poolInfoB: RaydiumPoolInfo,
  currentSolanaPriceUSD: number,
  desc = true,
): number => {
  const aprA: number = formatAprToNumber(
    calculateAPR(poolInfoA, currentSolanaPriceUSD),
  );
  const aprB: number = formatAprToNumber(
    calculateAPR(poolInfoB, currentSolanaPriceUSD),
  );

  if (desc) {
    if (aprA > aprB) return -1;
  } else if (aprB > aprA) return -1;
};

export const formatNumberToPercent = (num: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);

export const formatNumberWithSpaceSeparator = (num: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(num)
    .replaceAll(',', ' ');

export const formatNumberToCurrency = (num: number): string => {
  if (!num) {
    return '0';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
    .format(num)
    .replaceAll(',', ' ');
};

export const formatTotalToNumber = (formatAmount: number | string): number =>
  Number(formatAmount?.toString().replace(' ', ''));

export const formatAprToNumber = (formatAmount: number | string): number =>
  Number(formatAmount?.toString().replace('%', ''));

export const calculateTotalDeposit = (
  baseTokenAmount: string,
  quoteTokenAmount: string,
  currentSolanaPriceUSD: number,
): number => {
  const allQuoteTokenPriceUSD: number =
    Number(baseTokenAmount) * currentSolanaPriceUSD;

  const baseTokenPriceUSD: number =
    (Number(baseTokenAmount) / Number(quoteTokenAmount)) *
    currentSolanaPriceUSD;

  const allBaseTokenPriceUSD: number =
    baseTokenPriceUSD * Number(quoteTokenAmount);

  return allBaseTokenPriceUSD + allQuoteTokenPriceUSD;
};

export const calcTotalForCreateLiquidity = (
  baseTokenAmount: string,
  quoteTokenAmount: string,
  tokenPrice: string,
  currentSolanaPriceUSD: number,
): string => {
  const allQuoteTokenPriceUSD: number =
    Number(quoteTokenAmount) * currentSolanaPriceUSD;

  const allBaseTokenPriceUSD =
    Number(tokenPrice) * Number(baseTokenAmount) * currentSolanaPriceUSD;

  return formatNumberToCurrency(allBaseTokenPriceUSD + allQuoteTokenPriceUSD);
};

export const calcFusionMainRewards = (
  mainRouter: MainRouterView,
  stakeAccount: StakeAccountView,
  solanaTimestamp: number, //? Unix timestamp
): number => {
  if (!mainRouter || !stakeAccount) return 0;

  const reward =
    ((Number(mainRouter.cumulative) +
      Number(mainRouter.apr) * (solanaTimestamp - Number(mainRouter.lastTime)) -
      Number(stakeAccount.stakedAtCumulative)) *
      Number(stakeAccount.amount)) /
    (1e10 / Number(mainRouter.decimalsInput)) /
    Number(mainRouter.decimalsInput) /
    Number(mainRouter.decimalsOutput);

  return reward;
};

export const caclFusionSecondRewards = (
  stakeAccount: StakeAccountView,
  secondaryReward: SecondaryRewardView,
  secondaryStakeAccount: SecondStakeAccountView,
  mainRouter: MainRouterView,
  solanaTimestamp: number, //? Unix timestamp
): number => {
  if (
    !stakeAccount ||
    !secondaryReward ||
    !secondaryStakeAccount ||
    !mainRouter
  )
    return 0;

  let check_date: BN;

  if (Number(stakeAccount.stakeEnd) > 0) {
    const check_date1 = min(
      new BN(solanaTimestamp),
      new BN(stakeAccount.stakeEnd),
    );
    check_date = min(check_date1, new BN(secondaryReward.endTime));
  } else {
    check_date = min(new BN(solanaTimestamp), new BN(secondaryReward.endTime));
  }

  if (secondaryReward && secondaryStakeAccount) {
    const calculation =
      ((check_date.toNumber() -
        max(
          new BN(secondaryStakeAccount.lastHarvestedAt),
          new BN(stakeAccount.stakedAt),
        ).toNumber()) *
        Number(secondaryReward.tokensPerSecondPerPoint) *
        Number(stakeAccount.amount)) /
      Number(mainRouter.decimalsInput) /
      Number(secondaryReward.decimalsOutput);
    return calculation;
  } else {
    const calculation =
      ((check_date.toNumber() -
        max(
          new BN(secondaryReward.startTime),
          new BN(stakeAccount.stakedAt),
        ).toNumber()) *
        Number(secondaryReward.tokensPerSecondPerPoint) *
        Number(stakeAccount.amount)) /
      Number(mainRouter.decimalsInput) /
      Number(secondaryReward.decimalsOutput);

    return calculation;
  }
};

export const getStakedBalance = (
  fusionPoolInfo: FusionPoolInfo,
  lpDecimals: number,
): number => Number(fusionPoolInfo?.stakeAccount?.amount) / 10 ** lpDecimals;

export const sumFusionAndRaydiumApr = (
  fusionPoolInfo: FusionPoolInfo,
  poolStats: PoolStats,
): number => {
  if (fusionPoolInfo?.mainRouter) {
    const SECONDS_IN_YEAR = 31536000;
    const { apr, endTime, decimalsInput } = fusionPoolInfo.mainRouter;

    return (
      (((Number(apr) * Number(endTime)) / SECONDS_IN_YEAR) * 1e2) /
        (1e10 / Number(decimalsInput)) +
      poolStats?.apr
    );
  }
  return poolStats?.apr || 0;
};
