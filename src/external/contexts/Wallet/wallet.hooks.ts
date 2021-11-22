import { useContext } from 'react';

import { WalletContext } from './wallet.context';
import { useWalletValue } from './wallet.model';

export const useWallet = (): useWalletValue => {
  const {
    wallet,
    connected,
    provider,
    openSelectModal,
    isSelectModalVisible,
    closeSelectModal,
    setAutoConnect,
    providerUrl,
    setProviderUrl,
  } = useContext(WalletContext);
  return {
    wallet,
    connected,
    provider,
    openSelectModal,
    isSelectModalVisible,
    closeSelectModal,
    providerUrl,
    setProviderUrl,
    setAutoConnect,
    publicKey: wallet?.publicKey,
    connect(): void {
      wallet ? wallet.connect() : openSelectModal();
    },
    disconnect(): void {
      wallet?.disconnect();
    },
  };
};
