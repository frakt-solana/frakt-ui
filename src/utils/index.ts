import { notification } from 'antd';
import { AccountInfo, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';

import { formatNumber } from '../external/utils/utils';
import { Notify } from '../external/models';

export const notify: Notify = ({
  message = '',
  description = null,
  type = 'info',
}) => {
  (notification as any)[type]({
    className: 'fraktion__notification',
    message,
    description,
    placement: 'bottomRight',
  });
};

export const DECIMALS_PER_FRKT = 1e8;

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

export interface Token {
  mint: string;
  symbol: string;
  img: string;
  data: any;
}

export const getTokenImageUrl = (mint: string): string => {
  return `https://sdk.raydium.io/icons/${mint}.png`;
};

export interface ArweaveAttribute {
  trait_type: string;
  value: number | string;
}

export interface ArweaveMetadata {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points?: number;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: ArweaveAttribute[];
  properties: any;
}

export const copyToClipboard = (value: string): void => {
  navigator.clipboard.writeText(value);
  notify({
    message: 'Copied to clipboard',
    type: 'success',
  });
};
