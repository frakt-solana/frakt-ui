export const POOLS = '/pools';

export enum POOL_TABS {
  BUY = 'buy',
  SELL = 'sell',
  SWAP = 'swap',
  INFO = 'info',
}

export const createPoolLink = (
  tab = POOL_TABS.BUY,
  poolPubkey = ':poolPubkey',
): string => `${POOLS}/${poolPubkey}/${tab}`;

export const PATHS = {
  ROOT: '/',
  SWAP: '/swap',
  POOLS,
  POOL_BUY: createPoolLink(POOL_TABS.BUY),
  POOL_SELL: createPoolLink(POOL_TABS.SELL),
  POOL_SWAP: createPoolLink(POOL_TABS.SWAP),
  POOL_INFO: createPoolLink(POOL_TABS.INFO),
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
  BORROW: '/borrow',
};
