import { ReactNode } from 'react';

export interface WalletModalContextInterface {
  visible: boolean;
  setVisible: (nextState: boolean) => void;
}

export interface WalletModalProviderProps {
  children: ReactNode;
}
