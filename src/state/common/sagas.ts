import { selectConnection } from './selectors';
import { Connection } from '@solana/web3.js';
import moment from 'moment';
import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import { sagaMiddleware } from '../store';
import loansSagas from '../loans/sagas';
import { commonTypes, commonActions } from './actions';
import { tokenListActions } from '../tokenList/actions';
import { networkRequest, connectSocket } from '../../utils/state';
import { parseSolanaHealth } from './helpers';

const appInitSaga = function* () {
  yield put(commonActions.fetchSolanaHealth());
  yield put(tokenListActions.fetchTokenList());
  const socket = yield call(connectSocket);
  yield put(commonActions.setSocket(socket));
  sagaMiddleware.run(loansSagas(socket));
};

const fetchSolanaHealthSaga = function* () {
  yield put(commonActions.fetchSolanaHealthPending());
  try {
    const data = yield call(networkRequest, {
      url: 'https://ping.solana.com/mainnet-beta/last6hours',
    });

    yield put(
      commonActions.fetchSolanaHealthFulfilled(parseSolanaHealth(data)),
    );
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

const fetchUserStatusSaga = function* (action) {
  yield put(commonActions.fetchUserPending());
  try {
    const data = yield call(networkRequest, {
      //url: `https://${process.env.BACKEND_DOMAIN}/user/${action.payload}`,
      url: `http://localhost:3001/user/${action.payload}`,
    });

    if (data.statusCode) {
      yield put(commonActions.fetchUserFulfilled(null));
    } else {
      yield put(commonActions.fetchUserFulfilled(data));
    }
  } catch (error) {
    yield put(commonActions.fetchUserFailed(error));
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
  yield all([takeLatest(commonTypes.FETCH_USER, fetchUserStatusSaga)]);
};

export default commonSagas;
