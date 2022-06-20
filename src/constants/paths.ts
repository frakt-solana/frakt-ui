export const POOLS = '/pools';

export enum POOL_TABS {
  BUY = 'buy',
  SELL = 'sell',
  SWAP = 'swap',
  STAKE = 'stake',
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
  POOL_STAKE: createPoolLink(POOL_TABS.STAKE),
  POOL_INFO: createPoolLink(POOL_TABS.INFO),
  WALLET: '/wallet',
  PAGE_404: '/404',
  WALLET_PUBKEY: '/:walletPubkey',
  TEST: '/market_test',
  BORROW: '/borrow',
  LOANS: '/loans',
  STATS: '/stats',
  ROADMAP: 'https://trello.com/b/jt9JRdLg/frakt-public-roadmap',
};
