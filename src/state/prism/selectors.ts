import { Prism } from '@prism-hq/prism-ag';
import { pathOr, identity, equals } from 'ramda';
import { createSelector } from 'reselect';

import { RequestStatus } from '../../utils/state/types';
import { PrismState } from './types';

export const selectPrism: (state: Prism) => Prism = createSelector(
  [pathOr(null, ['prism', 'data'])],
  identity,
);

export const selectLoading = createSelector(
  [pathOr('', ['prism', 'status'])],
  equals(RequestStatus.PENDING),
);

export const selectPrismState: (state) => PrismState = createSelector(
  [selectPrism, selectLoading],
  (prism, loading) => ({
    prism,
    loading,
  }),
);
