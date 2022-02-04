import { ReactNode } from 'react';

export interface HeaderStateContextInterface {
  headerVisible: boolean;
  setHeaderVisible: (nextState: boolean) => void;
}

export interface HeaderStateProviderProps {
  children: ReactNode;
}
