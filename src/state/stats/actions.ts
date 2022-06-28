import { createCustomAction } from 'typesafe-actions';

import { ServerError } from '../../utils/state';

export const statsTypes = {
  FETCH_STATS: 'stats/FETCH_STATS',
  FETCH_STATS__PENDING: 'stats/FETCH_STATS__PENDING',
  FETCH_STATS__FULFILLED: 'stats/FETCH_STATS__FULFILLED',
  FETCH_STATS__FAILED: 'stats/FETCH_STATS__FAILED',
};

export const statsActions = {
  fetchStats: createCustomAction(statsTypes.FETCH_STATS, () => null),
  fetchStatsPending: createCustomAction(
    statsTypes.FETCH_STATS__PENDING,
    () => null,
  ),
  fetchStatsFulfilled: createCustomAction(
    statsTypes.FETCH_STATS__FULFILLED,
    (payload) => ({ payload }),
  ),
  fetchStatsFailed: createCustomAction(
    statsTypes.FETCH_STATS__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
};
