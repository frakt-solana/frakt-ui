import { Connection } from '@solana/web3.js';
import { swaps, raydium } from '@frakt-protocol/frakt-sdk';

import { PoolData } from '../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../utils';
import BN from 'bn.js';

// TODO: Remove after raydium version update!!!
export interface LiquidityPoolInfo {
  status: BN;
  baseDecimals: number;
  quoteDecimals: number;
  lpDecimals: number;
  baseReserve: BN;
  quoteReserve: BN;
  lpSupply: BN;
  startTime: BN;
}

type GetTokenPrice = (params: {
  poolData: PoolData;
  slippage: number;
  isBuy?: boolean;
  connection: Connection;
}) => Promise<{
  amount: string;
  amountWithSlippage: string;
  priceImpact: string;
}>;

export const getTokenPrice: GetTokenPrice = async ({
  poolData,
  slippage = 0.5,
  isBuy = true,
  connection,
}) => {
  const poolInfo = (await raydium.Liquidity.fetchInfo({
    connection,
    poolKeys: poolData?.poolConfig,
  })) as LiquidityPoolInfo;

  const persentSlippage = new raydium.Percent(
    Math.round(slippage * 100),
    10_000,
  );

  if (isBuy) {
    const { amountIn, maxAmountIn, priceImpact } = swaps.getInputAmount({
      poolKeys: poolData?.poolConfig,
      poolInfo,
      receiveToken: poolData?.tokenInfo,
      receiveAmount: 1,
      payToken: SOL_TOKEN,
      slippage: persentSlippage,
    });

    return {
      amount: amountIn,
      amountWithSlippage: maxAmountIn,
      priceImpact,
    };
  } else {
    const { amountOut, minAmountOut, priceImpact } = swaps.getOutputAmount({
      poolKeys: poolData?.poolConfig,
      poolInfo,
      payToken: poolData?.tokenInfo,
      payAmount: 1,
      receiveToken: SOL_TOKEN,
      slippage: persentSlippage,
    });

    return {
      amount: amountOut,
      amountWithSlippage: minAmountOut,
      priceImpact,
    };
  }
};
