import { all, call, takeLatest, put } from 'redux-saga/effects';

import { liquidationsTypes, liquidationsActions } from './actions';
import { networkRequest } from '../../utils/state';

const fetchGraceListSaga = function* () {
  yield put(liquidationsActions.fetchGraceListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation/grace-list`,
    });
    yield put(liquidationsActions.fetchGraceListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchGraceListFailed(error));
  }
};

const liquidationsSagas = function* (): Generator {
  yield all([
    takeLatest(liquidationsTypes.FETCH_GRACE_LIST, fetchGraceListSaga),
  ]);
};

export default liquidationsSagas;
