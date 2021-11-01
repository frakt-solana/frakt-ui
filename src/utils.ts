import { formatNumber } from './external/utils/utils';
import { AccountInfo, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const DECIMALS_PER_FRKT = 1e8;
export const getFrktBalanceValue = (balance: number): string =>
  `${balance ? (balance / DECIMALS_PER_FRKT).toFixed(6) : '--'}`;

export const getSolBalanceValue = (account: AccountInfo<Buffer>): string =>
  `${formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)}`;
