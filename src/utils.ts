import tokens from './tokens.json';
import { formatNumber } from './external/utils/utils';
import { AccountInfo, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const DECIMALS_PER_FRKT = 1e8;
export const getFrktBalanceValue = (balance: number): string =>
  `${balance ? (balance / DECIMALS_PER_FRKT).toFixed(6) : '--'}`;

export const getSolBalanceValue = (account: AccountInfo<Buffer>): string =>
  `${formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)}`;

export interface Token {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  extensions: {
    coingeckoId: string;
  };
}

//eslint-disable-next-line
export const getTokensList = () => {
  return tokens.spl;
};

export const DEFAULT_TOKEN = tokens.spl[Object.keys(tokens.spl)[0]];

export const getTokenImageUrl = (mint: string): string => {
  return `https://sdk.raydium.io/icons/${mint}.png`;
};
