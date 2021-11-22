import { ConnectionProviderProps } from '../Connection';
import { WalletProviderProps } from '../Wallet';

export interface WalletConnectionProviderProps
  extends WalletProviderProps,
    ConnectionProviderProps {}
