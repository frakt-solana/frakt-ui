import BN from 'bn.js';
import { MintInfo } from '@solana/spl-token';
import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';

import { TokenAccount } from './solanaUtils.model';
import { WAD, ZERO } from './solanaUtils.constants';

export type KnownTokenMap = Map<string, TokenInfo>;

export const formatPriceNumber = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

// shorten the checksummed version of the input address to have 4 characters at start and end
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const getTokenName = (
  map: KnownTokenMap,
  mint?: string | PublicKey,
  shorten = true,
): string => {
  const mintAddress = typeof mint === 'string' ? mint : mint?.toBase58();

  if (!mintAddress) {
    return 'N/A';
  }

  const knownSymbol = map.get(mintAddress)?.symbol;
  if (knownSymbol) {
    return knownSymbol;
  }

  return shorten ? `${mintAddress.substring(0, 5)}...` : mintAddress;
};

export const getTokenByName = (
  tokenMap: KnownTokenMap,
  name: string,
): TokenInfo => {
  let token: TokenInfo | null = null;
  for (const val of tokenMap.values()) {
    if (val.symbol === name) {
      token = val;
      break;
    }
  }
  return token;
};

export const getTokenIcon = (
  map: KnownTokenMap,
  mintAddress?: string | PublicKey,
): string | undefined => {
  const address =
    typeof mintAddress === 'string' ? mintAddress : mintAddress?.toBase58();
  if (!address) {
    return;
  }

  return map.get(address)?.logoURI;
};

export const isKnownMint = (
  map: KnownTokenMap,
  mintAddress: string,
): boolean => {
  return !!map.get(mintAddress);
};

export const STABLE_COINS = new Set(['USDC', 'wUSDC', 'USDT']);

export const chunks = <T>(array: T[], size: number): T[][] => {
  return Array.apply(
    /*<number, T[], T[][]>*/ 0,
    new Array(Math.ceil(array.length / size)),
  ).map((_: any, index: number) =>
    array.slice(index * size, (index + 1) * size),
  );
};

export const toLamports = (
  account?: TokenAccount | number,
  mint?: MintInfo,
): number => {
  if (!account) {
    return 0;
  }

  const amount =
    typeof account === 'number' ? account : account.info.amount?.toNumber();

  const precision = Math.pow(10, mint?.decimals || 0);
  return Math.floor(amount * precision);
};

export const wadToLamports = (amount?: BN): BN => {
  return amount?.div(WAD) || ZERO;
};

export const fromLamports = (
  account?: TokenAccount | number | BN,
  mint?: MintInfo,
  rate = 1.0,
): number => {
  if (!account) {
    return 0;
  }

  const amount = Math.floor(
    typeof account === 'number'
      ? account
      : BN.isBN(account)
      ? account.toNumber()
      : account.info.amount.toNumber(),
  );

  const precision = Math.pow(10, mint?.decimals || 0);
  return (amount / precision) * rate;
};

const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

const abbreviateNumber = (number: number, precision: number): string => {
  const tier = (Math.log10(number) / 3) | 0;
  let scaled = number;
  const suffix = SI_SYMBOL[tier];
  if (tier !== 0) {
    const scale = Math.pow(10, tier * 3);
    scaled = number / scale;
  }

  return scaled.toFixed(precision) + suffix;
};

export const formatAmount = (val: number, precision = 6, abbr = true): string =>
  abbr ? abbreviateNumber(val, precision) : val.toFixed(precision);

export const formatTokenAmount = (
  account?: TokenAccount,
  mint?: MintInfo,
  rate = 1.0,
  prefix = '',
  suffix = '',
  precision = 6,
  abbr = false,
): string => {
  if (!account) {
    return '';
  }

  return `${[prefix]}${formatAmount(
    fromLamports(account, mint, rate),
    precision,
    abbr,
  )}${suffix}`;
};

export const formatUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const isSmallNumber = (val: number): boolean => {
  return val < 0.001 && val > 0;
};

export const formatNumber = {
  format: (val?: number, useSmall?: boolean): string | number => {
    if (!val) {
      return '--';
    }
    if (useSmall && isSmallNumber(val)) {
      return 0.001;
    }

    return numberFormatter.format(val);
  },
};

export const feeFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 9,
});

export const formatPct = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const convert = (
  account?: TokenAccount | number,
  mint?: MintInfo,
  rate = 1.0,
): number => {
  if (!account) {
    return 0;
  }

  const amount =
    typeof account === 'number' ? account : account.info.amount?.toNumber();

  const precision = Math.pow(10, mint?.decimals || 0);
  const result = (amount / precision) * rate;

  return result;
};
