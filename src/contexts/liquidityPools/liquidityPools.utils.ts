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

    return formatNumberWithSpaceSeparator(
      allBaseTokenPriceUSD * allQuoteTokenPriceUSD,
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

  const apr = formatNumberToPercent(totalLiquidity * 0.00012);
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

const formatNumberToPercent = (num: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);

const formatNumberWithSpaceSeparator = (num: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(num)
    .replaceAll(',', ' ');

const formatNumberToCurrency = (num: number): string => {
  if (!num) {
    return '0';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
    .format(num)
    .replaceAll(',', ' ');
};

export const formatTotalToNumber = (formatAmount: number | string): number =>
  Number(formatAmount?.toString().replace(' ', ''));

export const formatAprToNumber = (formatAmount: number | string): number =>
  Number(formatAmount?.toString().replace('%', ''));

export const calculateTotalDeposit = (
  baseTokenAmount: string,
  quoteTokenAmount: string,
  currentSolanaPriceUSD: number,
): string => {
  const allQuoteTokenPriceUSD: number =
    Number(baseTokenAmount) * currentSolanaPriceUSD;

  const baseTokenPriceUSD: number =
    (Number(baseTokenAmount) / Number(quoteTokenAmount)) *
    currentSolanaPriceUSD;

  const allBaseTokenPriceUSD: number =
    baseTokenPriceUSD * Number(quoteTokenAmount);

  return formatNumberToCurrency(allBaseTokenPriceUSD + allQuoteTokenPriceUSD);
};

export const calcTotalForCreateLiquidity = (
  baseTokenAmount: string,
  quoteTokenAmount: string,
  tokenPrice: string,
  currentSolanaPriceUSD: number,
): string => {
  const allQuoteTokenPriceUSD: number =
    Number(quoteTokenAmount) * currentSolanaPriceUSD;

  const allBaseTokenPriceUSD =
    Number(tokenPrice) * Number(baseTokenAmount) * currentSolanaPriceUSD;

  return formatNumberToCurrency(allBaseTokenPriceUSD + allQuoteTokenPriceUSD);
};
