import { createSelector } from 'reselect';
import {
  pathOr,
  identity,
  pathEq,
  sortBy,
  compose,
  reverse,
  propOr,
  ifElse,
} from 'ramda';
import { isArray } from 'ramda-adjunct';

import { BorrowNft, LiquidityPool, Loan } from './types';
import {
  selectWalletPublicKey,
  // selectSolanaTimestamp,
} from '../common/selectors';

// const isOwnedByUser = curry((publicKey) =>
//   publicKey ? propEq('user', publicKey.toBase58()) : false,
// );

export const selectUserLoans: (state: Loan[]) => Loan[] = createSelector(
  [pathOr([], ['loans', 'loans', 'data']), selectWalletPublicKey],
  identity,
);

export const selectUserLoansPending = createSelector(
  [pathEq(['loans', 'loans', 'data'], null)],
  identity,
);

export const selectLiquidityPools: (
  state: LiquidityPool[],
) => LiquidityPool[] | null = createSelector(
  [pathOr(null, ['loans', 'liquidityPools', 'data'])],
  ifElse(
    isArray,
    compose(reverse<LiquidityPool>, sortBy(propOr(0, 'totalLiquidity'))),
    identity,
  ),
);

export const selectHiddenBorrowNfts: (state: string[]) => string[] =
  createSelector([pathOr([], ['loans', 'hiddenBorrowNfts'])], identity);

export const selectHiddenLoanNfts: (state: string[]) => string[] =
  createSelector([pathOr([], ['loans', 'hiddenLoanNfts'])], identity);

export const selectAllBorrowNfts: (state: BorrowNft[]) => BorrowNft[] =
  createSelector([pathOr([], ['loans', 'borrowNfts'])], identity);

export const selectBorrowNfts: (state: BorrowNft[]) => BorrowNft[] =
  createSelector(
    [selectHiddenBorrowNfts, selectAllBorrowNfts],
    (hiddenBorrowNfts, borrowNfts) =>
      borrowNfts?.filter(({ mint }) => !hiddenBorrowNfts.includes(mint)) || [],
  );

export const selectLoanNfts: (state: Loan[]) => Loan[] = createSelector(
  [selectHiddenLoanNfts, selectUserLoans],
  (hiddenLoanNfts, loanNfts) =>
    loanNfts?.filter(({ mint }) => !hiddenLoanNfts.includes(mint)) || [],
);
