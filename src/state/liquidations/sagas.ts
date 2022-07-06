import { all, call, takeLatest, put } from 'redux-saga/effects';

import { liquidationsTypes, liquidationsActions } from './actions';
import { networkRequest } from '../../utils/state';

const fetchGraceListSaga = function* (action) {
  const isSearch = action.payload.searchStr
    ? `search=${action.payload.searchStr}&`
    : '';
  const isSortBy = action.payload.isSortBy
    ? `sortBy=${action.payload.isSortBy}&`
    : '';
  const isSortOrder = action.payload.isSortOrder
    ? `sort=${action.payload.isSortOrder}`
    : '';

  yield put(liquidationsActions.fetchGraceListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation/grace-list?${isSearch}${isSortBy}${isSortOrder}`,
    });
    console.log(data);
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
