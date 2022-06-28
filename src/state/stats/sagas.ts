import { all, call, takeLatest, put } from 'redux-saga/effects';

import { statsTypes, statsActions } from './actions';
import { networkRequest } from '../../utils/state';

const fetchStatsSaga = function* () {
  yield put(statsActions.fetchStatsPending());
  try {
    const [dailyStats, totalStats, lendingPools, lastLoans] = yield all([
      yield call(networkRequest, {
        url: `https://${process.env.BACKEND_DOMAIN}/stats/daily`,
      }),
      yield call(networkRequest, {
        url: `https://${process.env.BACKEND_DOMAIN}/stats/total`,
      }),
      yield call(networkRequest, {
        url: `https://${process.env.BACKEND_DOMAIN}/stats/lending-pools`,
      }),
      yield call(networkRequest, {
        url: `https://${process.env.BACKEND_DOMAIN}/stats/last-loans`,
      }),
    ]);
    yield put(
      statsActions.fetchStatsFulfilled({
        dailyStats,
        totalStats,
        lendingPools,
        lastLoans,
      }),
    );
  } catch (error) {
    yield put(statsActions.fetchStatsFailed(error));
  }
};

const statsSagas = function* (): Generator {
  yield all([takeLatest(statsTypes.FETCH_STATS, fetchStatsSaga)]);
};

export default statsSagas;
