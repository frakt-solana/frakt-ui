import { DepositView, LiquidityPoolView } from '@frakters/nft-lending-v2';

export const calcLoansPoolReward = (
  liquidityPool: LiquidityPoolView,
  userDeposit: DepositView,
): number => {
  if (!liquidityPool?.apr || !userDeposit?.amount) return 0;

  const { lastTime, period, apr, cumulative } = liquidityPool;
  const { stakedAtCumulative, amount } = userDeposit;

  let differentTime = Date.now() / 1000 - lastTime;

  if (differentTime > period) {
    differentTime = period - 1;
  }

  const rewardCumulative = differentTime * apr + cumulative;

  return (
    ((rewardCumulative - stakedAtCumulative) * amount) / 1e4 / period / 1e9
  );
};

export const calcUtilizationRateInPercent = (
  liquidityPool: LiquidityPoolView,
): number => {
  if (!liquidityPool?.apr) return 0;

  const { liquidityAmount, amountOfStaked } = liquidityPool;
  return liquidityAmount / amountOfStaked / 100;
};

export const calcLoanApr = (liquidityPool: LiquidityPoolView): number => {
  if (!liquidityPool?.apr) return 0;

  const TIME_IN_YEAR = 31536000;
  const { apr, period } = liquidityPool;

  return (apr / 1e2 / period) * TIME_IN_YEAR;
};
