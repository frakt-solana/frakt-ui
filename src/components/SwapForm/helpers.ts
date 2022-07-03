import { raydium, TokenInfo } from '@frakt-protocol/frakt-sdk';

interface AmountOutParams {
  poolKeys: raydium.LiquidityPoolKeysV4;
  poolInfo: raydium.LiquidityPoolInfo;
  payToken: TokenInfo;
  payAmount: number;
  receiveToken: TokenInfo;
  slippage?: raydium.Percent;
}

export const getOutputAmount = ({
  poolKeys,
  poolInfo,
  payToken,
  payAmount,
  receiveToken,
  slippage = new raydium.Percent(1, 100),
}: AmountOutParams): {
  amountOut: string;
  minAmountOut: string;
  priceImpact: string;
} => {
  try {
    const amountIn = new raydium.TokenAmount(
      new raydium.Token(
        payToken.address,
        payToken.decimals,
        payToken.symbol,
        payToken.name,
      ),
      payAmount,
      false,
    );

    const { amountOut, minAmountOut, priceImpact } =
      raydium.Liquidity.computeAmountOut({
        poolKeys,
        poolInfo,
        amountIn,
        currencyOut: receiveToken,
        slippage,
      });

    return {
      amountOut: amountOut.toSignificant(),
      minAmountOut: minAmountOut.toSignificant(),
      priceImpact: priceImpact.toSignificant(),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return {
      amountOut: '',
      minAmountOut: '',
      priceImpact: '',
    };
  }
};

interface AmountInParams {
  poolKeys: raydium.LiquidityPoolKeysV4;
  poolInfo: raydium.LiquidityPoolInfo;
  receiveToken: TokenInfo;
  receiveAmount: number;
  payToken: TokenInfo;
  slippage?: raydium.Percent;
}

export const getInputAmount = ({
  poolKeys,
  poolInfo,
  receiveToken,
  receiveAmount,
  payToken,
  slippage = new raydium.Percent(1, 100),
}: AmountInParams): {
  amountIn: string;
  maxAmountIn: string;
  priceImpact: string;
} => {
  try {
    const amountOut = new raydium.TokenAmount(
      new raydium.Token(
        receiveToken.address,
        receiveToken.decimals,
        receiveToken.symbol,
        receiveToken.name,
      ),
      receiveAmount,
      false,
    );

    const { amountIn, maxAmountIn, priceImpact } =
      raydium.Liquidity.computeAmountIn({
        poolKeys,
        poolInfo,
        amountOut,
        currencyIn: payToken,
        slippage,
      });

    return {
      amountIn: amountIn.toSignificant(),
      maxAmountIn: maxAmountIn.toSignificant(),
      priceImpact: priceImpact.toSignificant(),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return {
      amountIn: '',
      maxAmountIn: '',
      priceImpact: '',
    };
  }
};

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
