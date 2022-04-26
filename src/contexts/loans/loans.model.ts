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
  loansProgramAccounts: LoansProgramAccount;
  loading: boolean;
  paybackLoan: (params: any) => Promise<any>;
  proposeLoan: (params: any) => Promise<any>;
  approvedLoan: (params: any) => Promise<any>;
}

export interface LoansProgramAccount {
  collectionInfo: CollectionInfoView[];
  deposit: DepositView[];
  liquidityPool: LiquidityPoolView[];
  loan: LoanView[];
}

export type LoansProviderType = (props: { children: ReactNode }) => JSX.Element;
