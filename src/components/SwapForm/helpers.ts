import {
  CurrencyAmount,
  Liquidity,
  LiquidityPoolKeysV4,
  Percent,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';
import { RaydiumPoolInfo } from '../../contexts/liquidityPools';

export const getOutputAmount = (
  poolKeys: LiquidityPoolKeysV4,
  poolInfo: RaydiumPoolInfo,
  baseToken: TokenInfo,
  baseTokenAmount: number,
  quoteToken: TokenInfo,
  slippage = 1,
): string => {
  try {
    const isBuy = baseToken.address !== poolKeys.baseMint.toBase58();

    console.log(isBuy);

    console.log(baseToken.decimals);

    const { anotherCurrencyAmount } = Liquidity.computeAnotherCurrencyAmount({
      poolKeys,
      poolInfo,
      currencyAmount: new CurrencyAmount(
        baseToken,
        new BN(baseTokenAmount * 10 ** baseToken.decimals),
      ),
      anotherCurrency: quoteToken,
      slippage: new Percent(1, 100),
    });

    console.log(anotherCurrencyAmount.toSignificant());
    return anotherCurrencyAmount.toSignificant();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
