import { createSelector } from 'reselect';
import { pathOr, path, equals, applySpec } from 'ramda';

import { TotalStats, DailyActivity, LastLoans, LedningPools } from './types';

export const selectStatsData = createSelector(
  [path(['stats', 'data'])],
  applySpec<{
    dailyActivity: DailyActivity;
    totalStats: TotalStats;
    lendingPools: LedningPools[];
    lastLoans: LastLoans[];
  }>({
    dailyActivity: pathOr({}, ['dailyActivity']),
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
  ({ totalStats, dailyActivity, lendingPools, lastLoans }, isLoading) => ({
    totalStats,
    dailyActivity,
    lendingPools,
    lastLoans,
    loading: isLoading,
  }),
);
