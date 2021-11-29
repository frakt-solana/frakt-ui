import { WSOL } from '@raydium-io/raydium-sdk';

export const SOL_TOKEN = {
  mint: WSOL.mint,
  symbol: 'SOL',
  img: 'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
  data: {
    address: WSOL.mint,
    decimals: WSOL.decimals,
    symbol: WSOL.symbol,
    name: WSOL.name,
  },
};
