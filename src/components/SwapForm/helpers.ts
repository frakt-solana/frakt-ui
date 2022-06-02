import {
  Liquidity,
  LiquidityPoolKeysV4,
  Percent,
  TokenAmount,
  Token,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import { RaydiumPoolInfo } from '../../contexts/liquidityPools';

interface ComputeAnotherAmountParams {
  poolKeys: LiquidityPoolKeysV4;
  poolInfo: RaydiumPoolInfo;
  token: TokenInfo;
  amount: number;
  anotherCurrency: TokenInfo;
  slippage?: Percent;
}

export const computeAnotherAmount = ({
  poolKeys,
  poolInfo,
  token,
  amount,
  anotherCurrency,
  slippage = new Percent(1, 100),
}: ComputeAnotherAmountParams): {
  anotherAmount: string;
  maxAnotherAmount: string;
} => {
  try {
    const tokenAmount = new TokenAmount(
      new Token(token.address, token.decimals, token.symbol, token.name),
      amount,
      false,
    );

    const { anotherAmount, maxAnotherAmount } = Liquidity.computeAnotherAmount({
      poolKeys,
      poolInfo,
      amount: tokenAmount,
      anotherCurrency,
      slippage,
    });

    return {
      anotherAmount: anotherAmount.toSignificant(),
      maxAnotherAmount: maxAnotherAmount.toSignificant(),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
