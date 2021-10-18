import { clusterApiUrl } from '@solana/web3.js';
import { ENV as ChainID } from '@solana/spl-token-registry';

export type ENV = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet';

export const ENDPOINTS = [
  {
    name: 'mainnet-beta' as ENV,
    endpoint:
      'https://withered-dawn-rain.solana-mainnet.quiknode.pro/0cdeb8d22478dfd10a69465e6179687022b07d28/',
    chainID: ChainID.MainnetBeta,
  },
  {
    name: 'testnet' as ENV,
    endpoint: clusterApiUrl('testnet'),
    chainID: ChainID.Testnet,
  },
  {
    name: 'devnet' as ENV,
    endpoint:
      'https://weathered-summer-haze.solana-devnet.quiknode.pro/b07da26993397d1ce695394f636bc3415bc91a97/',
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
};

const mainnet = {
  ENDPOINT: ENDPOINTS[0],
};

export default process.env.REACT_APP_NETWORK === 'devnet' ? devnet : mainnet;
