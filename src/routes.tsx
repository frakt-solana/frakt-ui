import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WalletProvider } from './external/contexts/wallet';
import { ConnectionProvider } from './external/contexts/connection';
import { AccountsProvider } from './external/contexts/accounts';
import { MarketProvider } from './external/contexts/market';
import { URLS } from './constants';

import Page404 from './pages/Page404';
import HomePage from './pages/HomePage';
import ExchangePage from './pages/ExchangePage';
import VaultsPage from './pages/VaultsPage';
import StakerPage from './pages/StakerPage';
import FraktionalizePage from './pages/FraktionalizePage';
import { ConnectWalletModal } from './components/ConnectWallerModal';

export function Routes(): JSX.Element {
  return (
    <Router>
      <ConnectionProvider>
        <WalletProvider>
          <AccountsProvider>
            <MarketProvider>
              <Switch>
                <Route
                  exact
                  path={URLS.ROOT}
                  component={(): JSX.Element => <HomePage />}
                />
                <Route
                  exact
                  path={URLS.VAULTS}
                  component={(): JSX.Element => <VaultsPage />}
                />
                <Route
                  exact
                  path={URLS.EXCHANGE}
                  component={(): JSX.Element => <ExchangePage />}
                />
                <Route
                  exact
                  path={URLS.STAKER_PAGE}
                  component={(): JSX.Element => <StakerPage />}
                />
                <Route
                  exact
                  path={URLS.FRAKTIONALIZE}
                  component={(): JSX.Element => <FraktionalizePage />}
                />

                <Route
                  exact
                  path={URLS.PAGE_404}
                  component={(): JSX.Element => <Page404 />}
                />
                <Route
                  exact
                  path={'*'}
                  component={(): JSX.Element => <Page404 />}
                />
              </Switch>
              <ConnectWalletModal />
            </MarketProvider>
          </AccountsProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
}
