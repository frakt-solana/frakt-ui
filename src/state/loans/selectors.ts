import { createSelector } from 'reselect';
import { pathOr, identity, pathEq } from 'ramda';

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

export const selectLiquidityPools: (state: LiquidityPool[]) => LiquidityPool[] =
  createSelector([pathOr(null, ['loans', 'liquidityPools', 'data'])], identity);

export const selectHiddenBorrowNfts: (state: string[]) => string[] =
  createSelector([pathOr([], ['loans', 'hiddenBorrowNfts'])], identity);

export const selectAllBorrowNfts: (state: BorrowNft[]) => BorrowNft[] =
  createSelector([pathOr([], ['loans', 'borrowNfts'])], identity);

export const selectBorrowNfts: (state: BorrowNft[]) => BorrowNft[] =
  createSelector(
    [selectHiddenBorrowNfts, selectAllBorrowNfts],
    (hiddenBorrowNfts, borrowNfts) =>
      borrowNfts?.filter(({ mint }) => !hiddenBorrowNfts.includes(mint)) || [],
  );
