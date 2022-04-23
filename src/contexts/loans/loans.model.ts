import { ReactNode } from 'react';
import {
  CollectionInfoView,
  DepositView,
  LiquidityPoolView,
  LoanView,
} from '@frakters/nft-lending-v2/lib/accounts';

export type FetchDataFunc = () => Promise<void>;

export interface LoansContextValues {
  fetchLoansData: FetchDataFunc;
  loading: boolean;
  getLoanBack: (params: any) => Promise<any>;
  createLoan: (params: any) => Promise<any>;
}

export interface LoanProgramAccount {
  collectionInfo: CollectionInfoView[];
  deposit: DepositView[];
  liquidityPool: LiquidityPoolView[];
  loan: LoanView[];
}

export type LoansProviderType = (props: { children: ReactNode }) => JSX.Element;
