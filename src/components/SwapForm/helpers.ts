import { raydium } from '@frakt-protocol/frakt-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

interface ComputeAnotherAmountParams {
  poolKeys: raydium.LiquidityPoolKeysV4;
  poolInfo: raydium.LiquidityPoolInfo;
  token: TokenInfo;
  amount: number;
  anotherCurrency: TokenInfo;
  slippage?: raydium.Percent;
}

export const computeAnotherAmount = ({
  poolKeys,
  poolInfo,
  token,
  amount,
  anotherCurrency,
  slippage = new raydium.Percent(1, 100),
}: ComputeAnotherAmountParams): {
  anotherAmount: string;
  maxAnotherAmount: string;
} => {
  try {
    const tokenAmount = new raydium.TokenAmount(
      new raydium.Token(
        token.address,
        token.decimals,
        token.symbol,
        token.name,
      ),
      amount,
      false,
    );

    const { anotherAmount, maxAnotherAmount } =
      raydium.Liquidity.computeAnotherAmount({
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
