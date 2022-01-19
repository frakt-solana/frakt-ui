import { RaydiumPoolInfo } from './liquidityPools.model';

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

    return groupNumberBySpace(
      formatNumberTotal.format(allBaseTokenPriceUSD * allQuoteTokenPriceUSD),
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

  const apr = formatPercent.format(totalLiquidity * 0.00012);
  return apr;
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

const numberFormatterTotal = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatNumberTotal = {
  format: (val?: number): string | number => {
    if (!val) {
      return '--';
    }

    return numberFormatterTotal.format(val);
  },
};

export const formatPercent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const groupNumberBySpace = (formatAmount: string | number): string =>
  formatAmount.toString().replace(',', ' ');

export const formatTotalToNumber = (formatAmount: number | string): number =>
  Number(formatAmount?.toString().replace(' ', ''));

export const formatAprToNumber = (formatAmount: number | string): number =>
  Number(formatAmount?.toString().replace('%', ''));
