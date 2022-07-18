import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  SolletWalletAdapter,
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
import { ENDPOINT } from './config';
// import { IntercomService, INTERCOM_APP_ID } from './utils/intercom';
import { createBrowserHistory } from 'history';
import { initSentry } from './utils/sentry';

const history = createBrowserHistory();
initSentry(history);

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new SlopeWalletAdapter(),
  new GlowWalletAdapter(),
  new LedgerWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
];

const App: FC = () => {
  return (
    <ReduxProvider store={store}>
      <ConnectionProvider endpoint={ENDPOINT}>
        <WalletProvider wallets={wallets} autoConnect>
          {/* <IntercomProvider appId={INTERCOM_APP_ID}> */}
          <Router />
          {/* <IntercomService /> */}
          {/* </IntercomProvider> */}
        </WalletProvider>
      </ConnectionProvider>
    </ReduxProvider>
  );
};

export default App;
