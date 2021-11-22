import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { MathWalletWalletAdapter } from '@solana/wallet-adapter-mathwallet';

export const WALLET_PROVIDERS = [
  {
    name: 'Phantom',
    url: 'https://phantom.app/',
    icon: 'https://raydium.io/_nuxt/img/phantom.d9e3c61.png',
    adapter: PhantomWalletAdapter,
  },
  {
    name: 'Solflare',
    url: 'https://solflare.com/access-wallet',
    icon: 'https://raydium.io/_nuxt/img/solflare-extension.3702e31.png',
    adapter: SolflareWalletAdapter,
  },
  {
    name: 'Sollet',
    url: 'https://www.sollet.io',
    icon: 'https://raydium.io/_nuxt/img/sollet-web.b2db20f.png',
    adapter: SolletWalletAdapter,
  },
  {
    name: 'MathWallet',
    url: 'https://mathwallet.org',
    icon: 'https://raydium.io/_nuxt/img/mathwallet.1e2ff52.png',
    adapter: MathWalletWalletAdapter,
  },
];
