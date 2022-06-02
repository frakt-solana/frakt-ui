import { ReactNode } from 'react';
import { LoanDataByPoolPublicKey } from '@frakt-protocol/frakt-sdk';
import {
  CollectionInfoView,
  DepositView,
  LiquidityPoolView,
  LoanView,
} from '@frakters/nft-lending-v2/lib/accounts';

import { ArweaveMetadata } from '../../utils/getArweaveMetadata';

export type FetchDataFunc = () => Promise<void>;

export interface LoansContextValues {
  initialFetch: FetchDataFunc;
  refetch: FetchDataFunc;
  loanDataByPoolPublicKey: LoanDataByPoolPublicKey;
  removeLoanOptimistic: RemoveLoanOptimistic;
  loading: boolean;
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
  userLoans: LoanWithArweaveMetadata[];
  userLoansLoading: boolean;
}

export type LoansProviderType = (props: { children: ReactNode }) => JSX.Element;

export interface LoanData {
  collectionsInfo: CollectionInfoView[];
  deposits: DepositView[];
  liquidityPool: LiquidityPoolView;
  loans: LoanView[];
}

export interface LoanWithArweaveMetadata {
  loan: LoanView;
  metadata: ArweaveMetadata;
}

export type RemoveLoanOptimistic = (loan: LoanView) => void;
