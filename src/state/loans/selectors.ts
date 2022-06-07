import { createSelector } from 'reselect';
import {
  compose,
  pathOr,
  map,
  applySpec,
  identity,
  prop,
  sortBy,
  filter,
  propEq,
  pathEq,
  curry,
  allPass,
} from 'ramda';

import { LoanWithMetadata } from './types';
import { selectWalletPublicKey } from '../common/selectors';

const activatedLoan = propEq('loanStatus', 'activated');
const ownedByUser = curry((publicKey) => propEq('user', publicKey.toBase58()));

export const selectUserLoans: (state) => Array<LoanWithMetadata> =
  createSelector(
    [pathOr([], ['loans', 'list', 'data']), selectWalletPublicKey],
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
        filter(allPass([activatedLoan, ownedByUser(publicKey)])),
      )(loans),
  );

export const selectUserLoansPending = createSelector(
  [pathEq(['loans', 'list', 'data'], null)],
  identity,
);
