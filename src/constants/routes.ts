import { FC } from 'react';

import { PATHS } from './paths';
import {
  Page404,
  HomePage,
  WalletPage,
  StatsPage,
  LoansPage,
  BorrowPage,
} from '../pages';

interface Route {
  path: string;
  exact: boolean;
  component: FC;
}

export const routes: Route[] = [
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
    path: `${PATHS.WALLET}${PATHS.WALLET_PUBKEY}`,
    component: WalletPage,
  },
  {
    exact: true,
    path: PATHS.STATS,
    component: StatsPage,
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
