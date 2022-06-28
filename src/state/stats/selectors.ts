import { createSelector } from 'reselect';
import { pathOr, path, equals, applySpec } from 'ramda';

import { TotalStats, DailyStats, LastLoans, LedningPools } from './types';

export const selectStatsData = createSelector(
  [path(['stats', 'data'])],
  applySpec<{
    dailyStats: DailyStats;
    totalStats: TotalStats;
    lendingPools: LedningPools[];
    lastLoans: LastLoans[];
  }>({
    dailyStats: pathOr({}, ['dailyStats']),
    totalStats: pathOr({}, ['totalStats']),
    lendingPools: pathOr([], ['lendingPools']),
    lastLoans: pathOr([], ['lastLoans']),
  }),
);

export const selectStatsIsLoading = createSelector(
  [path(['stats', 'status'])],
  equals('PENDING'),
);

export const selectStats = createSelector(
  [selectStatsData, selectStatsIsLoading],
  ({ totalStats, dailyStats, lendingPools, lastLoans }, isLoading) => ({
    totalStats,
    dailyStats,
    lendingPools,
    lastLoans,
    loading: isLoading,
  }),
);
