import { formatNumber } from '../external/utils/utils';
import { AccountInfo, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';
import mintMetadata from '../mintMetadata.json';

export const DECIMALS_PER_FRKT = 1e8;

export const decimalBNToString = (
  bn: BN,
  precision = 2,
  lamports = 8,
): string => {
  const bnStr = bn.toString(10);
  if (bnStr === '0') return '0';
  const integerPart = bnStr.slice(0, -lamports);
  const floatPart = bnStr
    .padStart(lamports, '0')
    .slice(-lamports, -lamports + precision);
  return `${integerPart || 0}.${floatPart || 0}`;
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

export const getNFTArweaveMetadataByMint = (
  mint: string,
): ArweaveMetadata | null => {
  const metadata = mintMetadata[mint];
  return metadata ? (metadata as ArweaveMetadata) : null;
};
