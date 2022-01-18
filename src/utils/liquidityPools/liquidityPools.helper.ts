import { formatNumber } from '../solanaUtils';
import { RaydiumPoolInfo } from './../../contexts/liquidityPools/liquidityPools.model';
import { COINGECKO_URL } from './liquidityPools.constant';

export const fetchSolanaPriceUSD = async (): Promise<number> => {
  try {
    const result = await (
      await fetch(`${COINGECKO_URL}/simple/price?ids=solana&vs_currencies=usd`)
    ).json();

    return result.solana.usd;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('coingecko api error: ', e);
  }
};

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

    return formatNumber.format(allBaseTokenPriceUSD * allQuoteTokenPriceUSD);
  }
};

export const calculateAPR = () => {};
