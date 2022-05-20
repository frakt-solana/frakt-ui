import { ReactNode } from 'react';

export interface HealthModalContextInterface {
  visible: boolean;
  setVisible: (nextState: boolean) => void;
  config: { mode: 'warning' | 'error'; content: JSX.Element } | null;
}

export interface HealthModalProviderProps {
  children: ReactNode;
}
