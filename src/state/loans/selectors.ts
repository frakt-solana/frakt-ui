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
  concat,
  map,
  assoc,
} from 'ramda';
import { isArray } from 'ramda-adjunct';

import { BorrowNft, LiquidityPool, Loan } from './types';

// const isOwnedByUser = curry((publicKey) =>
//   publicKey ? propEq('user', publicKey.toBase58()) : false,
// );

const selectGraceLots: (state) => Loan[] = createSelector(
  [pathOr([], ['loans', 'loans', 'data', 'graceLots'])],
  identity,
);

const selectRestLoans: (state) => Loan[] = createSelector(
  [pathOr([], ['loans', 'loans', 'data', 'loans'])],
  identity,
);

export const selectUserLoans: (state) => Loan[] = createSelector(
  [selectGraceLots, selectRestLoans],
  (graceLots, restLoans) =>
    concat(map(assoc('isGracePeriod', true), graceLots), restLoans),
);

export const selectUserLoansPending: (state) => boolean = createSelector(
  [
    pathEq(['loans', 'loans', 'data', 'graceLots'], null),
    pathEq(['loans', 'loans', 'data', 'loans'], null),
  ],
  (graceLotsNull, restLoansNull) => graceLotsNull && restLoansNull,
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

export const selectLoanNfts: (state) => Loan[] = createSelector(
  [selectHiddenLoanNfts, selectUserLoans],
  (hiddenLoanNfts: string[], loanNfts: Loan[]) =>
    loanNfts?.filter(({ mint }) => !hiddenLoanNfts.includes(mint)) || [],
);
