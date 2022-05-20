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
import { IntercomProvider } from 'react-use-intercom';

import { Router } from './router';
import { UserTokensProvider } from './contexts/userTokens';
import { TokenListContextProvider } from './contexts/TokenList';
import { ENDPOINT, NETWORK } from './config';
import { WalletModalProvider } from './contexts/WalletModal';
import { HealthModalProvider } from './contexts/HealthModal';
import { LiquidityPoolsProvider } from './contexts/liquidityPools';
import { NftPoolsProvider } from './contexts/nftPools';
import { LoansProvider } from './contexts/loans';

import { IntercomService, INTERCOM_APP_ID } from './utils/intercom';

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getLedgerWallet(),
  getSolletWallet({ network: NETWORK as WalletAdapterNetwork }),
  getSolletExtensionWallet({ network: NETWORK as WalletAdapterNetwork }),
];

const App: FC = () => {
  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <HealthModalProvider>
            <IntercomProvider appId={INTERCOM_APP_ID}>
              <TokenListContextProvider>
                <UserTokensProvider>
                  <LiquidityPoolsProvider>
                     <NftPoolsProvider>
                       <LoansProvider>
                         <Router />
                       </LoansProvider>
                     </NftPoolsProvider>
                  </LiquidityPoolsProvider>
                </UserTokensProvider>
              </TokenListContextProvider>
              <IntercomService />
            </IntercomProvider>
          </HealthModalProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
