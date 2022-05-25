import { all, call, takeLatest, put } from 'redux-saga/effects';

import { commonTypes, commonActions } from './actions';

const networkRequest = (params) =>
  new Promise((resolve, reject) => {
    try {
      fetch(params.url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    } catch (error) {
      reject(error);
    }
  });

const appInitSaga = function* () {
  yield put(commonActions.fetchSolanaHealth());
};

const fetchSolanaHealthSaga = function* () {
  yield put(commonActions.fetchSolanaHealthPending());
  try {
    const data = yield call(networkRequest, {
      url: 'https://ping.solana.com/mainnet-beta/last6hours',
    });
    yield put(commonActions.fetchSolanaHealthFulfilled(data));
  } catch (error) {
    yield put(commonActions.fetchSolanaHealthFailed(error));
  }
};

const commonSagas = function* () {
  yield all([takeLatest(commonTypes.APP_INIT, appInitSaga)]);
  yield all([
    takeLatest(commonTypes.FETCH_SOLANA_HEALTH, fetchSolanaHealthSaga),
  ]);
};

export default commonSagas;
