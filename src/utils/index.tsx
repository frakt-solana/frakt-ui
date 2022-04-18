import { notification } from 'antd';
import { AccountInfo, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';
import { WSOL } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { Dictionary } from 'lodash';

import { formatNumber, Notify, NotifyType } from './solanaUtils';

export const notify: Notify = ({
  message = '',
  description = null,
  type = NotifyType.INFO,
}) => {
  notification[type]({
    className: 'fraktion__notification',
    message,
    description,
    placement: 'bottomRight',
  });
};

export const DECIMALS_PER_FRKT = 1e8;

export const SOL_TOKEN: TokenInfo = {
  chainId: 101,
  address: WSOL.mint,
  name: 'SOL',
  decimals: 9,
  symbol: 'SOL',
  logoURI:
    'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
  extensions: {
    coingeckoId: 'solana',
  },
};

export const FRKT_TOKEN: TokenInfo = {
  chainId: 101,
  address: 'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj',
  name: 'FRAKT Token',
  decimals: 8,
  symbol: 'FRKT',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/logo.png',
  extensions: {
    coingeckoId: 'frakt-token',
    twitter: 'https://twitter.com/FRAKT_HQ',
    website: 'https://frakt.xyz/',
  },
  tags: ['utility-token'],
};

export const decimalBNToString = (
  bn: BN,
  precision = 2,
  decimals = 9,
): string => {
  const bnStr = bn.toString(10).padStart(decimals, '0');
  if (bnStr === '0') return '0';
  const integerPart = bnStr.slice(0, -decimals);

  let floatPart = bnStr.slice(bnStr.length - decimals);
  const number = floatPart.replace(/^0+/g, '').replace(/0+$/g, '');
  floatPart = floatPart.replace(/0+$/g, '');

  if (floatPart.length - number.length < precision) {
    floatPart = floatPart.slice(0, precision);
  }

  if (floatPart) floatPart = '.' + floatPart;
  return `${integerPart || 0}${floatPart}`;
};

export const shortBigNumber = (bn: BN, precision = 2, decimals = 9): string => {
  const abbrev = ['K', 'M', 'B', 'T'];
  const dec = [3, 6, 9, 12];
  const bnString = bn.toString();

  if (bnString.length >= decimals + dec[0]) {
    const decimalString = bn.toString().slice(0, -decimals);

    for (let i = dec.length - 1; i >= 0; i--) {
      const curDec = dec[i];
      if (decimalString.length <= curDec) continue;

      const result = decimalString.slice(
        0,
        decimalString.length - curDec + precision,
      );
      let floatPart = result.slice(-precision).replace(/0+$/g, '');
      if (floatPart) floatPart = '.' + floatPart;
      return `${result.slice(0, -precision) || 0}${floatPart}${abbrev[i]}`;
    }
  }

  return decimalBNToString(bn, precision, decimals);
};

export const frktBNToString = (bn: BN, precision = 6): string => {
  const bnStr = bn.toString(10);
  if (bnStr === '0') return '0';
  const integerPart = bnStr.slice(0, -8);
  const floatPart = bnStr.padStart(8, '0').slice(-8, -8 + precision);
  return `${integerPart || 0}.${floatPart || 0}`;
};

export const getFrktBalanceValue = (balance: BN): string => {
  const frktBalance = balance ? frktBNToString(balance, 2) : '0';
  return `${frktBalance !== '0' ? frktBalance : '--'}`;
};

export const getSolBalanceValue = (account: AccountInfo<Buffer>): string =>
  `${formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)}`;

export const getTokenBalanceValue = (amountBN: BN, decimals: number): string =>
  `${formatNumber.format(
    (amountBN?.toNumber() || 0) / Math.pow(10, decimals),
  )}`;

export const copyToClipboard = (value: string): void => {
  navigator.clipboard.writeText(value);
  notify({
    message: 'Copied to clipboard',
    type: NotifyType.SUCCESS,
  });
};

export const getCollectionThumbnailUrl = (thumbaiUrl: string): string => {
  return `https://cdn.exchange.art/${thumbaiUrl?.replace(/ /g, '%20')}`;
};

export const pluralize = (count: number, noun: string, suffix = 's'): string =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

export const swapStringKeysAndValues = (
  obj: Dictionary<string>,
): Dictionary<string> => {
  const swapped = Object.entries(obj).map(([key, value]) => [value, key]);

  return Object.fromEntries(swapped);
};
