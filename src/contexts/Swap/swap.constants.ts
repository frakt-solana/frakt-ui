import { FRKT_TOKEN_MINT_PUBLIC_KEY } from '../../config';

export const RAYDIUM_POOLS_LIST_URL =
  'https://sdk.raydium.io/liquidity/mainnet.json';

//? Add some external spl tokens in swappableTokensMap
export const ADDITIONAL_SWAPPABLE_TOKENS_MINTS = [
  FRKT_TOKEN_MINT_PUBLIC_KEY,
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', //? RAY
];

//? To avoid repetitive pools (FRKT)
export const BLOCKED_POOLS_IDS = [
  'H3dhkXcC5MRN7VRXNbWVSvogH8mUQPzpn8PYQL7HfBVg',
  // 'DqMPkcRT22dPTTsj2rxhCNxg44D93NXiSBWiACAAXd2Q',
];
