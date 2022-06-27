import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  getLedgerWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
// import { IntercomProvider } from 'react-use-intercom';

import { Router } from './router';
import store from './state/store';
import { UserTokensProvider } from './contexts/userTokens';
import { ENDPOINT } from './config';
import { LiquidityPoolsProvider } from './contexts/liquidityPools';
import { NftPoolsProvider } from './contexts/nftPools';
// import { IntercomService, INTERCOM_APP_ID } from './utils/intercom';
import { createBrowserHistory } from 'history';
import { initSentry } from './utils/sentry';

const history = createBrowserHistory();
initSentry(history);

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getLedgerWallet(),
  getSolletWallet({ network: WalletAdapterNetwork.Mainnet }),
  getSolletExtensionWallet({ network: WalletAdapterNetwork.Mainnet }),
];

const App: FC = () => {
  return (
    <ReduxProvider store={store}>
      <ConnectionProvider endpoint={ENDPOINT}>
        <WalletProvider wallets={wallets} autoConnect>
          {/* <IntercomProvider appId={INTERCOM_APP_ID}> */}
          <UserTokensProvider>
            <LiquidityPoolsProvider>
              <NftPoolsProvider>
                <Router />
              </NftPoolsProvider>
            </LiquidityPoolsProvider>
          </UserTokensProvider>
          {/* <IntercomService /> */}
          {/* </IntercomProvider> */}
        </WalletProvider>
      </ConnectionProvider>
    </ReduxProvider>
  );
};

export default App;
