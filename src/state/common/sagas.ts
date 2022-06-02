import { selectConnection } from './selectors';
import { Connection } from '@solana/web3.js';
import moment from 'moment';
import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import { commonTypes, commonActions } from './actions';

const networkRequest = (params: any) =>
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

const fetchSolanaTimestampSaga = function* () {
  yield put(commonActions.fetchSolanaTimestampPending());
  try {
    const connection = yield select(selectConnection);
    const data = yield call(async (connection: Connection) => {
      try {
        const { absoluteSlot: lastSlot } = await connection.getEpochInfo();
        const solanaTimeUnix = await connection.getBlockTime(lastSlot);
        return solanaTimeUnix || moment().unix();
      } catch (error) {
        return moment().unix();
      }
    }, connection);
    yield put(commonActions.fetchSolanaTimestampFulfilled(data));
  } catch (error) {
    yield put(commonActions.fetchSolanaTimestampFailed(error));
  }
};

const commonSagas = function* (): Generator {
  yield all([takeLatest(commonTypes.APP_INIT, appInitSaga)]);
  yield all([
    takeLatest(commonTypes.FETCH_SOLANA_HEALTH, fetchSolanaHealthSaga),
  ]);
  yield all([
    takeLatest(commonTypes.FETCH_SOLANA_TIMESTAMP, fetchSolanaTimestampSaga),
  ]);
};

export default commonSagas;
