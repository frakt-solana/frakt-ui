import { ReactNode } from 'react';

import { LoanWithNftData } from '../../utils/loans';

export type FetchDataFunc = () => Promise<void>;

export interface LoansContextValues {
  loading: boolean;
  loansData: LoanWithNftData[];
  fetchLoansData: FetchDataFunc;
  estimations: EstimateNFT[];
  isPawnshopAuthenticated: boolean;
  pawnshopLogin: () => Promise<void>;
}

export interface EstimateNFT {
  candymachine_address: [];
  createdAt: string;
  floorPrice: number;
  id: string;
  name: string;
  nfts: [];
  returnAmount: number;
  status_id: string;
  valuation: number;
}

export type LoansProviderType = (props: { children: ReactNode }) => JSX.Element;
