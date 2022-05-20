import { FC } from 'react';

import { PATHS } from './paths';
import {
  Page404,
  HomePage,
  SwapPage,
  WalletPage,
  PoolsPage,
  NFTPoolsPage,
  NFTPoolBuyPage,
  NFTPoolSellPage,
  NFTPoolSwapPage,
  NFTPoolInfoPage,
  // NFTPoolsTestPage,
  LoansPage,
  BorrowPage,
} from '../pages';

interface Route {
  path: string;
  exact: boolean;
  component: FC;
}

export const routes: Route[] = [
  // {
  // exact: true,
  //   path: PATHS.TEST,
  //   component: NFTPoolsTestPage,
  // },
  {
    exact: true,
    path: PATHS.LOANS,
    component: LoansPage,
  },
  {
    exact: true,
    path: PATHS.BORROW,
    component: BorrowPage,
  },
  {
    exact: true,
    path: PATHS.ROOT,
    component: HomePage,
  },
  {
    exact: true,
    path: PATHS.POOLS,
    component: NFTPoolsPage,
  },
  {
    exact: true,
    path: PATHS.POOL_BUY,
    component: NFTPoolBuyPage,
  },
  {
    exact: true,
    path: PATHS.POOL_SELL,
    component: NFTPoolSellPage,
  },
  {
    exact: true,
    path: PATHS.POOL_SWAP,
    component: NFTPoolSwapPage,
  },
  {
    exact: true,
    path: PATHS.POOL_INFO,
    component: NFTPoolInfoPage,
  },
  {
    exact: true,
    path: PATHS.SWAP,
    component: SwapPage,
  },
  {
    exact: true,
    path: `${PATHS.WALLET}${PATHS.WALLET_PUBKEY}`,
    component: WalletPage,
  },
  {
    exact: true,
    path: PATHS.EARN,
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
