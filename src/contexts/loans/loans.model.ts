import { ReactNode } from 'react';
import {
  CollectionInfoView,
  DepositView,
  LiquidityPoolView,
  LoanView,
} from '@frakters/nft-lending-v2/lib/accounts';

import { ArweaveMetadata } from '../../utils/getArweaveMetadata';

export type FetchDataFunc = () => Promise<void>;

export interface LoansContextValues {
  fetchLoansData: FetchDataFunc;
  loanDataByPoolPublicKey: LoanDataByPoolPublicKey;
  removeLoanOptimistic: RemoveLoanOptimistic;
  loading: boolean;
}

export type LoansProviderType = (props: { children: ReactNode }) => JSX.Element;

export interface LoanData {
  collectionsInfo: CollectionInfoView[];
  deposits: DepositView[];
  liquidityPool: LiquidityPoolView;
  loans: LoanView[];
}

export type LoanDataByPoolPublicKey = Map<string, LoanData>;

export interface LoanWithArweaveMetadata {
  loan: LoanView;
  metadata: ArweaveMetadata;
}

export type RemoveLoanOptimistic = (loan: LoanView) => void;
