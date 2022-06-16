import { createSelector } from 'reselect';
import {
  compose,
  pathOr,
  applySpec,
  identity,
  prop,
  path,
  sortBy,
  filter,
  propEq,
  pathEq,
  curry,
  allPass,
  find,
  converge,
  divide,
  __,
  always,
  tryCatch,
  ifElse,
  multiply,
} from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';

import {
  BorrowNft,
  Lending,
  LiquidityPoolsState,
  // LiquidityPoolView,
  LoansPoolInfo,
  LoanView,
} from './types';
import {
  selectWalletPublicKey,
  selectSolanaTimestamp,
} from '../common/selectors';

export const LOAN_POOL_PUBKEY = 'FuydvCEeh5sa4YyPzQuoJFBRJ4sF5mwT4rbeaWMi3nuN';
const SECONDS_IN_YEAR = 31536000;

const isActivatedLoan = propEq('loanStatus', 'activated');
const isOwnedByUser = curry((publicKey) =>
  publicKey ? propEq('user', publicKey.toBase58()) : false,
);
const processOr = curry((defaultValue, func) =>
  tryCatch(
    compose(ifElse(isNilOrEmpty, always(defaultValue), identity), func),
    always(defaultValue),
  ),
);

export const selectUserLoans: (state) => Array<LoanView> = createSelector(
  [pathOr([], ['loans', 'loans', 'data']), selectWalletPublicKey],
  (loans, publicKey) =>
    compose<any, Array<LoanView>, Array<LoanView>>(
      sortBy(prop('expiredAt')),
      filter(allPass([isActivatedLoan, isOwnedByUser(publicKey)])),
    )(loans),
);

export const selectUserLoansPending = createSelector(
  [pathEq(['loans', 'loans', 'data'], null)],
  identity,
);

export const selectLending: (state: any) => any = createSelector(
  [pathOr([], ['loans', 'lendings', 'data'])],
  find(pathEq(['liquidityPool', 'liquidityPoolPubkey'], LOAN_POOL_PUBKEY)),
);

export const selectLiquidityPools: (
  state: LiquidityPoolsState,
) => LiquidityPoolsState = createSelector(
  [pathOr(null, ['loans', 'lendings', 'data'])],
  identity,
);

export const selectLiquidityPoolInfo: (state) => LoansPoolInfo = createSelector(
  [selectLending, selectSolanaTimestamp],
  (lending, solanaTimestamp) =>
    applySpec<LoansPoolInfo>({
      apr: processOr(
        0,
        compose(
          multiply(100),
          divide(__, 1e11),
          multiply(SECONDS_IN_YEAR),
          path(['liquidityPool', 'apr']),
        ),
      ),
      totalBorrowed: processOr(
        0,
        converge(
          (amountOfStaked: number, liquidityAmount: number) =>
            (amountOfStaked - liquidityAmount) / 1e9,
          [
            path(['liquidityPool', 'amountOfStaked']),
            path(['liquidityPool', 'liquidityAmount']),
          ],
        ),
      ),
      utilizationRate: processOr(
        0,
        converge(
          (amountOfStaked: number, liquidityAmount: number) =>
            ((amountOfStaked - liquidityAmount) / amountOfStaked) * 100,
          [
            path(['liquidityPool', 'amountOfStaked']),
            path(['liquidityPool', 'liquidityAmount']),
          ],
        ),
      ),
      totalSupply: processOr(
        0,
        compose(divide(__, 1e9), path(['liquidityPool', 'amountOfStaked'])),
      ),
      loans: pathOr(0, ['activeLoansCount']),
      depositAmount: compose(divide(__, 1e9), pathOr(0, ['deposit', 'amount'])),
      rewardAmount: (lending: Lending) => {
        const apr = path<number>(['liquidityPool', 'apr'], lending);
        const depositAmount = path<number>(['deposit', 'amount'], lending);
        if (!apr || !depositAmount) return 0;

        const { lastTime, period, cumulative } = lending.liquidityPool;
        const { stakedAtCumulative, amount } = lending.deposit;

        let timeDiff = solanaTimestamp - lastTime;

        if (timeDiff > period) {
          timeDiff = period - 1;
        }

        const rewardCumulative = timeDiff * apr + cumulative;
        const rewardAmount =
          ((rewardCumulative - stakedAtCumulative) * amount) / 1e11 / 1e9;
        return rewardAmount < 0 ? 0 : rewardAmount;
      },
    })(lending),
);

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
