import React, { FC, useContext, useState } from 'react';
import {
  WalletModalContextInterface,
  WalletModalProviderProps,
} from './walletModal.model';

export const WalletModalContext =
  React.createContext<WalletModalContextInterface>({
    visible: false,
    setVisible: () => {},
  });

export const WalletModalProvider: FC<WalletModalProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <WalletModalContext.Provider
      value={{
        visible,
        setVisible,
      }}
    >
      {children}
    </WalletModalContext.Provider>
  );
};

export const useWalletModal = (): WalletModalContextInterface => {
  const { setVisible, visible } = useContext(WalletModalContext);

  return { setVisible, visible };
};
