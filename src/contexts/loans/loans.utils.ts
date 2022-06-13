import { DepositView, LiquidityPoolView } from '@frakt-protocol/frakt-sdk';

export const calcLoanPoolReward = (
  liquidityPool: LiquidityPoolView,
  userDeposit: DepositView,
  solanaTimestamp: number,
): number => {
  if (!liquidityPool?.apr || !userDeposit?.amount) return 0;

  const { lastTime, period, apr, cumulative } = liquidityPool;
  const { stakedAtCumulative, amount } = userDeposit;

  let differentTime = solanaTimestamp - lastTime;

  if (differentTime > period) {
    differentTime = period - 1;
  }

  const rewardCumulative = differentTime * apr + cumulative;

  return ((rewardCumulative - stakedAtCumulative) * amount) / 1e11 / 1e9;
};

export const calcLoanPoolApr = (liquidityPool: LiquidityPoolView): number => {
  if (!liquidityPool?.apr) return 0;

  const SECONDS_IN_YEAR = 31536000;

  return ((liquidityPool.apr * SECONDS_IN_YEAR) / 1e11) * 100;
};
