import { PublicKey } from '@solana/web3.js';

//? To avoid repetitive pools (FRKT)
export const BLOCKED_POOLS_IDS = [
  'DqMPkcRT22dPTTsj2rxhCNxg44D93NXiSBWiACAAXd2Q',
];

//? Using for fetching prices of tokens in USD
export const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

export const vaultProgramId = new PublicKey(
  'JCrmDPsceQew2naUT1UosJLaPW5K6QnV54frXjcBkXvc',
);
