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
  loansProgramAccounts: LoansProgramAccounts;
  availableCollections: AvailableCollections[];
  loading: boolean;
  paybackLoan: (params: any) => Promise<any>;
  proposeLoan: (params: any) => Promise<any>;
}

export interface LoansProgramAccounts {
  collectionInfo: CollectionInfoView[];
  deposit: DepositView[];
  liquidityPool: LiquidityPoolView[];
  loan: LoanView[];
}

export interface AvailableCollections {
  collection_info: string;
  creator: string;
  description: string;
  name: string;
  royalty_address: string;
  whitelisted_mints: string[];
}

export type LoansProviderType = (props: { children: ReactNode }) => JSX.Element;
