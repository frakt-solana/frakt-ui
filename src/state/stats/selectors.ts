import { pathOr, identity, equals } from 'ramda';
import { createSelector } from 'reselect';

import { RequestStatus } from '../../utils/state/types';
import { Stats, StatsState } from './types';

export const selectStats: (state: Stats) => Stats = createSelector(
  [pathOr(null, ['stats', 'data'])],
  identity,
);

export const selectLoading = createSelector(
  [pathOr('', ['stats', 'status'])],
  equals(RequestStatus.PENDING),
);

export const selectStatsState: (state) => StatsState = createSelector(
  [selectStats, selectLoading],
  (stats, loading) => ({
    stats,
    loading,
  }),
);
