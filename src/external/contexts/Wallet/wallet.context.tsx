import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocalStorageState } from '../../hooks';
import { WALLET_PROVIDERS } from './wallet.contants';
import {
  WalletContextInterface,
  WalletProviderProps,
  WalletAdapter,
} from './wallet.model';

export const WalletContext = React.createContext<WalletContextInterface>({
  wallet: undefined,
  connected: false,
  provider: undefined,
  providerUrl: null,
  setProviderUrl() {},
  setAutoConnect: null,
  openSelectModal() {},
  closeSelectModal() {},
  isSelectModalVisible: false,
});

const WalletProvider = ({
  children = null,
  notify = (value) => {
    value;
  },
}: WalletProviderProps): JSX.Element => {
  const [autoConnect, setAutoConnect] = useState(false);
  const [providerUrl, setProviderUrl] = useLocalStorageState('walletProvider');

  const provider = useMemo(
    () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
    [providerUrl],
  );

  const wallet = useMemo(() => {
    if (provider) {
      return new provider.adapter(providerUrl) as WalletAdapter;
    }
  }, [provider, providerUrl]);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', () => {
        if (wallet.publicKey) {
          setConnected(true);
          const walletPublicKey = wallet.publicKey.toBase58();
          const keyToDisplay =
            walletPublicKey.length > 20
              ? `${walletPublicKey.substring(
                  0,
                  7,
                )}.....${walletPublicKey.substring(
                  walletPublicKey.length - 7,
                  walletPublicKey.length,
                )}`
              : walletPublicKey;

          notify({
            message: 'Wallet update',
            description: 'Connected to wallet ' + keyToDisplay,
          });
        }
      });

      wallet.on('disconnect', () => {
        setConnected(false);
        notify({
          message: 'Wallet update',
          description: 'Disconnected from wallet',
        });
      });

      wallet.on('error', (error) => {
        if (error.name === 'WalletNotInstalledError') {
          notify({
            type: 'error',
            message: 'Wallet not installed',
          });
        } else {
          notify({
            type: 'error',
            message: 'Something went wrong',
          });
        }
      });
    }

    return (): void => {
      setConnected(false);
      if (wallet) {
        wallet.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
    if (wallet && autoConnect) {
      wallet.connect();
      setAutoConnect(false);
    }

    return (): void => {};
  }, [wallet, autoConnect]);

  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);

  const openSelectModal = useCallback(() => setIsSelectModalVisible(true), []);
  const closeSelectModal = useCallback(
    () => setIsSelectModalVisible(false),
    [],
  );

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        openSelectModal,
        provider,
        isSelectModalVisible,
        closeSelectModal,
        providerUrl,
        setProviderUrl,
        setAutoConnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
