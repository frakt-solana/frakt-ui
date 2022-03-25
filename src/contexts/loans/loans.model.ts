import { ReactNode } from 'react';
import { LoanWithNftData } from '../../utils/loans';

export interface LoansContextValues {
  loading: boolean;
  loansData: LoanWithNftData[];
}

export type LoansProviderType = ({
  children,
}: {
  children: ReactNode;
}) => JSX.Element;
