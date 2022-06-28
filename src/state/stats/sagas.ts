import { all, call, takeLatest, put } from 'redux-saga/effects';

import { statsTypes, statsActions } from './actions';
import { networkRequest } from '../../utils/state';

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
