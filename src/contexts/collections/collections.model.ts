import { ReactNode } from 'react';

export interface CollectionsContextInterface {
  loading: boolean;
}

export interface CollectionsProviderProps {
  children: ReactNode;
}
