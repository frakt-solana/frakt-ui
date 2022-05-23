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
import { tokenAuthFetchMiddleware } from '@strata-foundation/web3-token-auth';
import { FC } from 'react';
// import { IntercomProvider } from 'react-use-intercom';

import { Router } from './router';
import { UserTokensProvider } from './contexts/userTokens';
import { TokenListContextProvider } from './contexts/TokenList';
import { ENDPOINT, IS_DEVELOPMENT, JWT_ENDPOINT } from './config';
import { WalletModalProvider } from './contexts/WalletModal';
import { LiquidityPoolsProvider } from './contexts/liquidityPools';
import { NftPoolsProvider } from './contexts/nftPools';
import { LoansProvider } from './contexts/loans';
// import { IntercomService, INTERCOM_APP_ID } from './utils/intercom';

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getLedgerWallet(),
  getSolletWallet({ network: WalletAdapterNetwork.Mainnet }),
  getSolletExtensionWallet({ network: WalletAdapterNetwork.Mainnet }),
];

const getToken = async (): Promise<string> => {
  const content = await (await fetch(JWT_ENDPOINT)).json();
  return content?.access_token;
};

const App: FC = () => {
  return (
    <ConnectionProvider
      config={
        !IS_DEVELOPMENT
          ? { fetchMiddleware: tokenAuthFetchMiddleware({ getToken }) }
          : null
      }
      endpoint={ENDPOINT}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* <IntercomProvider appId={INTERCOM_APP_ID}> */}
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
          {/* <IntercomService /> */}
          {/* </IntercomProvider> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
