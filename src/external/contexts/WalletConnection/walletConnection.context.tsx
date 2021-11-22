import ConnectionProvider from '../Connection';
import WalletProvider from '../Wallet';
import { WalletConnectionProviderProps } from './walletConnection.model';

const WalletConnectionProvider = ({
  children,
  notify,
  endpoint,
  isDev,
}: WalletConnectionProviderProps): JSX.Element => {
  return (
    <ConnectionProvider endpoint={endpoint} isDev={isDev}>
      <WalletProvider notify={notify}>{children}</WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
