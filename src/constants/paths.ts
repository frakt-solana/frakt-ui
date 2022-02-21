export const MARKET = '/market';

export enum MARKET_TABS {
  BUY = 'buy',
  SELL = 'sell',
  SWAP = 'swap',
  INFO = 'info',
}

export const createMarketPoolLink = (
  tab = MARKET_TABS.BUY,
  poolPubkey = ':poolPubkey',
): string => `${MARKET}/${poolPubkey}/${tab}`;

export const PATHS = {
  ROOT: '/',
  SWAP: '/swap',
  MARKET,
  MARKET_BUY: createMarketPoolLink(MARKET_TABS.BUY),
  MARKET_SELL: createMarketPoolLink(MARKET_TABS.SELL),
  MARKET_SWAP: createMarketPoolLink(MARKET_TABS.SWAP),
  MARKET_INFO: createMarketPoolLink(MARKET_TABS.INFO),
  VAULTS: '/vaults',
  VAULT: '/vault',
  FRAKTIONALIZE: '/fraktionalize',
  WALLET: '/wallet',
  PAGE_404: '/404',
  COLLECTIONS: '/collections',
  COLLECTION: '/collection',
  VAULT_PUBKEY: '/:vaultPubkey',
  WALLET_PUBKEY: '/:walletPubkey',
  COLLECTION_NAME: '/:collectionName',
  YIELD: '/yield',
  TEST: '/market_test',
};
