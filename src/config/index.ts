import { clusterApiUrl } from '@solana/web3.js';
import { ENV as ChainID } from '@solana/spl-token-registry';

export type ENV = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet';

export const ENDPOINTS = [
  {
    name: 'mainnet-beta' as ENV,
    endpoint: 'https://ssc-dao.genesysgo.net/',
    chainID: ChainID.MainnetBeta,
  },
  {
    name: 'testnet' as ENV,
    endpoint: clusterApiUrl('testnet'),
    chainID: ChainID.Testnet,
  },
  {
    name: 'devnet' as ENV,
    endpoint: clusterApiUrl('devnet'),
    chainID: ChainID.Devnet,
  },
  {
    name: 'localnet' as ENV,
    endpoint: 'http://127.0.0.1:8899',
    chainID: ChainID.Devnet,
  },
];

const devnet = {
  ENDPOINT: ENDPOINTS[2],
  FRKT_TOKEN_MINT_PUBLIC_KEY: '2kMr32vCwjehHizggK4Gdv7izk7NhTUyLrH7RYvQRFHH',
};

const mainnet = {
  ENDPOINT: ENDPOINTS[0],
  FRKT_TOKEN_MINT_PUBLIC_KEY: 'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj',
};

export default process.env.REACT_APP_NETWORK === 'devnet' ? devnet : mainnet;
