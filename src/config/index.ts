export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const ENDPOINT = IS_DEVELOPMENT
  ? process.env.DEVELOPMENT_RPC_ENDPOINT
  : process.env.RPC_ENDPOINT;

export const FRKT_TOKEN_MINT_PUBLIC_KEY = process.env.FRKT_MINT;
