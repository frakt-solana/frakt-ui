import { all, call, put, takeLatest } from 'redux-saga/effects';
import { networkRequest } from '../../utils/state';

import { statsActions, statsTypes } from './actions';

const fetchStatsSaga = function* () {
  yield put(statsActions.fetchStatsPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/stats/all`,
    });
    yield put(statsActions.fetchStatsFulfilled(data));
  } catch (error) {
    yield put(statsActions.fetchStatsFailed(error));
  }
};

const statsSagas = function* (): Generator {
  yield all([takeLatest(statsTypes.FETCH_STATS, fetchStatsSaga)]);
};

export default statsSagas;
