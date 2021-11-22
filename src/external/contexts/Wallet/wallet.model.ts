export { BaseMessageSignerWalletAdapter as WalletAdapter } from '@solana/wallet-adapter-base';
import { BaseMessageSignerWalletAdapter as WalletAdapter } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
import { Notify } from '../../models';

import { WALLET_PROVIDERS } from './wallet.contants';

export interface WalletContextInterface {
  wallet: WalletAdapter | undefined;
  connected: boolean;
  provider: typeof WALLET_PROVIDERS[number] | undefined;
  providerUrl: any;
  setProviderUrl: any;
  setAutoConnect: any;
  openSelectModal: () => void;
  closeSelectModal: () => void;
  isSelectModalVisible: boolean;
}

export interface WalletProviderProps {
  children: JSX.Element | JSX.Element[] | null;
  notify: Notify;
}

export interface useWalletValue extends WalletContextInterface {
  publicKey?: PublicKey;
  connect?: () => void;
  disconnect?: () => void;
}
