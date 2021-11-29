import { Liquidity } from '@raydium-io/raydium-sdk';
import BN from 'bn.js';

import { PoolInfo } from '../../contexts/Swap';

export const getOutputAmount = (
  amount: string,
  poolInfo: PoolInfo,
  isBuy = true,
): string => {
  if (isBuy) {
    const value =
      Liquidity.getOutputAmount(
        new BN(Number(amount) * 10 ** poolInfo.quoteDecimals),
        poolInfo.quoteReserve,
        poolInfo.baseReserve,
      ).toNumber() /
      10 ** poolInfo.lpDecimals;

    return value.toString();
  }

  const value =
    Liquidity.getOutputAmount(
      new BN(Number(amount) * 10 ** poolInfo.lpDecimals),
      poolInfo.baseReserve,
      poolInfo.quoteReserve,
    ).toNumber() /
    10 ** poolInfo.quoteDecimals;

  return value.toString();
};
