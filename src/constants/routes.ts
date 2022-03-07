import { FC } from 'react';

import { PATHS } from './paths';
import {
  Page404,
  HomePage,
  SwapPage,
  VaultsPage,
  VaultPage,
  WalletPage,
  PoolsPage,
  FraktionalizePage,
  CollectionsPage,
  CollectionPage,
  // MarketPage,
  // MarketBuyPage,
  // MarketSellPage,
  // MarketSwapPage,
  // MarketInfoPage,
  // MarketTestPage,
} from '../pages';

interface Route {
  path: string;
  exact: boolean;
  component: FC;
}

export const routes: Route[] = [
  // {
  //   exact: true,
  //   path: PATHS.TEST,
  //   component: MarketTestPage,
  // },
  {
    exact: true,
    path: PATHS.ROOT,
    component: HomePage,
  },
  {
    exact: true,
    path: PATHS.VAULTS,
    component: VaultsPage,
  },
  {
    exact: true,
    path: `${PATHS.VAULT}${PATHS.VAULT_PUBKEY}`,
    component: VaultPage,
  },
  // {
  //   exact: true,
  //   path: PATHS.POOLS,
  //   component: MarketPage,
  // },
  // {
  //   exact: true,
  //   path: PATHS.POOL_BUY,
  //   component: MarketBuyPage,
  // },
  // {
  //   exact: true,
  //   path: PATHS.POOL_SELL,
  //   component: MarketSellPage,
  // },
  // {
  //   exact: true,
  //   path: PATHS.POOL_SWAP,
  //   component: MarketSwapPage,
  // },
  // {
  //   exact: true,
  //   path: PATHS.POOL_INFO,
  //   component: MarketInfoPage,
  // },
  {
    exact: true,
    path: PATHS.SWAP,
    component: SwapPage,
  },
  {
    exact: true,
    path: `${PATHS.FRAKTIONALIZE}${PATHS.VAULT_PUBKEY}?`,
    component: FraktionalizePage,
  },
  {
    exact: true,
    path: `${PATHS.WALLET}${PATHS.WALLET_PUBKEY}`,
    component: WalletPage,
  },
  {
    exact: true,
    path: PATHS.COLLECTIONS,
    component: CollectionsPage,
  },
  {
    exact: true,
    path: `${PATHS.COLLECTION}${PATHS.COLLECTION_NAME}`,
    component: CollectionPage,
  },
  {
    exact: true,
    path: PATHS.YIELD,
    component: PoolsPage,
  },
  {
    exact: true,
    path: PATHS.PAGE_404,
    component: Page404,
  },
  {
    exact: true,
    path: '*',
    component: Page404,
  },
];
