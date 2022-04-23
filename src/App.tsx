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

import { Router } from './router';
import { UserTokensProvider } from './contexts/userTokens';
import { FraktionProvider } from './contexts/fraktion';
import { TokenListContextProvider } from './contexts/TokenList';
import { ENDPOINT, NETWORK } from './config';
import { WalletModalProvider } from './contexts/WalletModal';
import { LiquidityPoolsProvider } from './contexts/liquidityPools';
import { NftPoolsProvider } from './contexts/nftPools';
import { LoansProvider } from './contexts/loans';

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getLedgerWallet(),
  getSolletWallet({ network: NETWORK as WalletAdapterNetwork }),
  getSolletExtensionWallet({ network: NETWORK as WalletAdapterNetwork }),
];

function App(): JSX.Element {
  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <TokenListContextProvider>
            <UserTokensProvider>
              <LiquidityPoolsProvider>
                <FraktionProvider>
                  <NftPoolsProvider>
                    <LoansProvider>
                      <Router />
                    </LoansProvider>
                  </NftPoolsProvider>
                </FraktionProvider>
              </LiquidityPoolsProvider>
            </UserTokensProvider>
          </TokenListContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
