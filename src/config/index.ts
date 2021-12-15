import { clusterApiUrl } from '@solana/web3.js';

export const IS_DEVNET = process.env.REACT_APP_NETWORK === 'devnet';

export const NETWORK = IS_DEVNET ? 'devnet' : 'mainnet-beta';

export const ENDPOINT = IS_DEVNET
  ? clusterApiUrl('devnet')
  : 'https://frakt.genesysgo.net/';
// : 'https://ssc-dao.genesysgo.net/';

export const FRKT_TOKEN_MINT_PUBLIC_KEY = IS_DEVNET
  ? '2kMr32vCwjehHizggK4Gdv7izk7NhTUyLrH7RYvQRFHH'
  : 'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj';
