import { ReactNode } from 'react';
import {
  CollectionInfoView,
  DepositView,
  LiquidityPoolView,
  LoanView,
} from '@frakters/nft-lending-v2/lib/accounts';
import { PublicKey } from '@solana/web3.js';
import {
  PaybackLoanTransactionParams,
  ProposeLoanTransactionParams,
} from './transactions';

export type FetchDataFunc = () => Promise<void>;

export interface LoansContextValues {
  fetchLoansData: FetchDataFunc;
  loansProgramAccounts: LoansProgramAccounts;
  availableCollections: AvailableCollections[];
  loading: boolean;
  paybackLoan: (params: PaybackLoanTransactionParams) => Promise<void>;
  proposeLoan: (params: ProposeLoanTransactionParams) => Promise<PublicKey>;
}

export interface LoansProgramAccounts {
  collectionInfo: CollectionInfoView[];
  deposit: DepositView[];
  liquidityPool: LiquidityPoolView[];
  loans: LoanView[];
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
