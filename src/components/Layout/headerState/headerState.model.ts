import { ReactNode } from 'react';

export interface HeaderStateContextValues {
  isHeaderHidden: boolean;
  setIsHeaderHidden: (nextState: boolean) => void;
}

export interface HeaderStateProviderProps {
  children: ReactNode;
}
