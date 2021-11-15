import { formatNumber } from '../external/utils/utils';
import { AccountInfo, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';
import mintMetadata from '../mintMetadata.json';

export const DECIMALS_PER_FRKT = 1e8;

export const decimalBNToString = (
  bn: BN,
  precision = 2,
  decimals = 8,
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

export function shortBigNumber(bn: BN, precision = 2, decimals = 9) {
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
}
/*
console.log('123 456 789 123 456 789.000000000')
console.log(shortBigNumber(new BN('123456789123456789000000000')))

console.log('456 789 123 456 789.000000000')
console.log(shortBigNumber(new BN('456789123456789000000000')))

console.log('56 789 123 456 789.000000000')
console.log(shortBigNumber(new BN('56789123456789000000000')))

console.log('6 789 123 456 789.000000000')
console.log(shortBigNumber(new BN('6789123456789000000000')))

console.log('789 123 456 789.000000000')
console.log(shortBigNumber(new BN('789123456789000000000')))

console.log('89 123 456 789.000000000')
console.log(shortBigNumber(new BN('89123456789000000000')))

console.log('9 123 456 789.000000000')
console.log(shortBigNumber(new BN('9123456789000000000')))

console.log('123 456 789.000000000')
console.log(shortBigNumber(new BN('123456789000000000')))


console.log('23 456 789.000000000')
console.log(shortBigNumber(new BN('23456789000000000')))


console.log('3 456 789.000000000')
console.log(shortBigNumber(new BN('3456789000000000')))

console.log('456 789.000000000')
console.log(shortBigNumber(new BN('456789000000000')))

console.log('56 789.000000000')
console.log(shortBigNumber(new BN('56789000000000')))

console.log('6 789.000000000')
console.log(shortBigNumber(new BN('6789000000000')))

console.log('789.000000000')
console.log(shortBigNumber(new BN('789000000000')))

console.log('89.000000000')
console.log(shortBigNumber(new BN('89000000000')))

console.log('9.000000000')
console.log(shortBigNumber(new BN('9000000000')))

console.log('0900000000')
console.log(shortBigNumber(new BN('900000000')))

console.log('0090000000')
console.log(shortBigNumber(new BN('90000000')))

console.log('0009000000')
console.log(shortBigNumber(new BN('9000000')))

console.log('000900000')
console.log(shortBigNumber(new BN('900000')))

console.log('0000090000')
console.log(shortBigNumber(new BN('90000')))

console.log('0000009000')
console.log(shortBigNumber(new BN('9000')))

console.log('0000000900')
console.log(shortBigNumber(new BN('900')))

console.log('0000000090')
console.log(shortBigNumber(new BN('90')))

console.log('0000000009')
console.log(shortBigNumber(new BN('9')))

console.log('1.002.000.000')
console.log(shortBigNumber(new BN('1002000000')))
*/

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

export const getNFTArweaveMetadataByMint = (
  mint: string,
): ArweaveMetadata | null => {
  const metadata = mintMetadata[mint];
  return metadata ? (metadata as ArweaveMetadata) : null;
};
