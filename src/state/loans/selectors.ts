import { createSelector } from 'reselect';
import {
  compose,
  pathOr,
  map,
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

import { LoanWithMetadata, LiquidityPoolView, LoansPoolInfo } from './types';
import {
  selectWalletPublicKey,
  selectSolanaTimestamp,
} from '../common/selectors';

const LOAN_POOL_PUBKEY = 'FuydvCEeh5sa4YyPzQuoJFBRJ4sF5mwT4rbeaWMi3nuN';
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

export const selectUserLoans: (state) => Array<LoanWithMetadata> =
  createSelector(
    [pathOr([], ['loans', 'loans', 'data']), selectWalletPublicKey],
    (loans, publicKey) =>
      compose<
        any,
        Array<LoanWithMetadata>,
        Array<LoanWithMetadata>,
        Array<LoanWithMetadata>
      >(
        map(
          applySpec({
            loan: identity,
            metadata: {
              name: prop('nftName'),
              image: prop('nftImageUrl'),
            },
          }),
        ),
        sortBy(prop('expiredAt')),
        filter(allPass([isActivatedLoan, isOwnedByUser(publicKey)])),
      )(loans),
  );

export const selectUserLoansPending = createSelector(
  [pathEq(['loans', 'loans', 'data'], null)],
  identity,
);

export const selectLending: (state) => LiquidityPoolView = createSelector(
  [pathOr([], ['loans', 'lending', 'data'])],
  find(pathEq(['liquidityPool', 'liquidityPoolPubkey'], LOAN_POOL_PUBKEY)),
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
        converge<any, any, any>(
          (amountOfStaked, liquidityAmount) =>
            (amountOfStaked - liquidityAmount) / 1e9,
          [
            path(['liquidityPool', 'amountOfStaked']),
            path(['liquidityPool', 'liquidityAmount']),
          ],
        ),
      ),
      utilizationRate: processOr(
        0,
        converge<any, any, any>(
          (amountOfStaked, liquidityAmount) =>
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
      rewardAmount: (lending) => {
        const arp = path(['liquidityPool', 'apr'], lending);
        const depositAmount = path(['deposit', 'amount'], lending);
        if (!arp || !depositAmount) return 0;

        const { lastTime, period, apr, cumulative } = lending.liquidityPool;
        const { stakedAtCumulative, amount } = lending.deposit;

        let differentTime = solanaTimestamp - lastTime;

        if (differentTime > period) {
          differentTime = period - 1;
        }

        const rewardCumulative = differentTime * apr + cumulative;
        const rewardAmount =
          ((rewardCumulative - stakedAtCumulative) * amount) / 1e11 / 1e9;
        return rewardAmount < 0 ? 0 : rewardAmount;
      },
    })(lending),
);
