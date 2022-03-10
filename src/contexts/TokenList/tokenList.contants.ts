import { FRKT_TOKEN_MINT_PUBLIC_KEY } from '../../config';

export const VERIFIED_BY_FRAKT_TEAM_TOKENS_URL =
  process.env.VERIFIED_TOKENS_BY_FRAKT_TEAM_URL;

//? Add some external spl tokens in swappableTokensMap
export const ADDITIONAL_SWAPPABLE_TOKENS_MINTS = [
  FRKT_TOKEN_MINT_PUBLIC_KEY,
  // '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', //? RAY
];
