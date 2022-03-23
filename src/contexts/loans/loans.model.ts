import { ReactNode } from 'react';

export interface LoansContextValues {
  loading: boolean;
  loansData: [];
}

export type LoansProviderType = ({
  children,
}: {
  children: ReactNode;
}) => JSX.Element;
