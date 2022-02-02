import { ReactNode } from 'react';

export interface HeaderStateContextInterface {
  visible: boolean;
  setVisible: (nextState: boolean) => void;
}

export interface HeaderStateProviderProps {
  children: ReactNode;
}
