import { notification } from 'antd';
import { web3, BN, TokenInfo } from '@frakt-protocol/frakt-sdk';
import { Dictionary } from 'lodash';

import { formatNumber, Notify, NotifyType } from './solanaUtils';
import { FRKT_TOKEN_MINT_PUBLIC_KEY } from '../config';

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

//? Using for fetching prices of tokens in USD
export const COINGECKO_URL = process.env.COINGECKO_URL;

export const SOL_TOKEN: TokenInfo = {
  chainId: 101,
  address: 'So11111111111111111111111111111111111111112',
  name: 'SOL',
  decimals: 9,
  symbol: 'SOL',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  extensions: {
    coingeckoId: 'solana',
  },
};

export const FRKT_TOKEN: TokenInfo = {
  chainId: 101,
  address: FRKT_TOKEN_MINT_PUBLIC_KEY,
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

export const USDT_TOKEN = {
  chainId: 101,
  address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  symbol: 'USDT',
  name: 'USDT',
  decimals: 6,
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
  tags: ['stablecoin'],
  extensions: {
    coingeckoId: 'tether',
    serumV3Usdc: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
    website: 'https://tether.to/',
  },
};

export const USDC_TOKEN = {
  chainId: 101,
  address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  tags: ['stablecoin'],
  extensions: {
    coingeckoId: 'usd-coin',
    serumV3Usdt: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
    website: 'https://www.centre.io/',
  },
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

export const getSolBalanceValue = (account: web3.AccountInfo<Buffer>): string =>
  `${formatNumber.format((account?.lamports || 0) / web3.LAMPORTS_PER_SOL)}`;

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

export const fetchSolanaPriceUSD = async (): Promise<number> => {
  try {
    const result = await (
      await fetch(`${COINGECKO_URL}/simple/price?ids=solana&vs_currencies=usd`)
    ).json();

    return result?.solana?.usd || 0;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('coingecko api error: ', error);
    return 0;
  }
};
export const getStakingPointsURL = (walletAddress: web3.PublicKey): string =>
  `https://frakt-stats.herokuapp.com/staking/${walletAddress}`;

export const getCorrectSolWalletBalance = (
  solWalletBalance: string,
): string => {
  return solWalletBalance.split(',').join('');
};

export const getDiscordUri = (wallet: web3.PublicKey | string): string => {
  const redirectUri = `https://${process.env.BACKEND_DOMAIN}/user`;
  const clientId = process.env.DISCORD_CLIENT_ID;

  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&response_type=code&scope=identify&state=${wallet}`;
};

export const getDiscordAvatarUrl = (discordId = '', hash = ''): string | null =>
  discordId && hash
    ? `https://cdn.discordapp.com/avatars/${discordId}/${hash}.png`
    : null;

export const compareNumbers = (
  numberA = 0,
  numberB = 0,
  desc = true,
): number => {
  if (desc) {
    if (numberA > numberB) return -1;
  } else if (numberB > numberA) return -1;
};
