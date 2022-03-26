import { ReactNode } from 'react';

import { LoanWithNftData } from '../../utils/loans';

export type FetchDataFunc = () => Promise<void>;

export interface LoansContextValues {
  loading: boolean;
  loansData: LoanWithNftData[];
  fetchLoansData: FetchDataFunc;
}

export type LoansProviderType = ({
  children,
}: {
  children: ReactNode;
}) => JSX.Element;
