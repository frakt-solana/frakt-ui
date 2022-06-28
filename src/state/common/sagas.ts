import { selectConnection, selectWalletPublicKey } from './selectors';
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

const sendFcmTokenSaga = function* (action) {
  const walletPublicKey = yield select(selectWalletPublicKey);
  yield call(networkRequest, {
    url: `https://${process.env.BACKEND_DOMAIN}/web`,
    config: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: action.payload,
        user: walletPublicKey,
        type: 'all',
      }),
    },
  });
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

const fetchUserSaga = function* (action) {
  yield put(commonActions.fetchUserPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/user/${action.payload}`,
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

const deleteUserSaga = function* (action) {
  try {
    yield call(
      fetch,
      `https://${process.env.BACKEND_DOMAIN}/user/${action.payload}/delete`,
    );
    yield put(commonActions.fetchUserFulfilled(null));
  } catch (error) {
    console.error(error);
  }
};

const commonSagas = function* (): Generator {
  yield all([takeLatest(commonTypes.APP_INIT, appInitSaga)]);
  yield all([takeLatest(commonTypes.SEND_FCM_TOKEN, sendFcmTokenSaga)]);
  yield all([
    takeLatest(commonTypes.FETCH_SOLANA_HEALTH, fetchSolanaHealthSaga),
  ]);
  yield all([
    takeLatest(commonTypes.FETCH_SOLANA_TIMESTAMP, fetchSolanaTimestampSaga),
  ]);
  yield all([takeLatest(commonTypes.FETCH_USER, fetchUserSaga)]);
  yield all([takeLatest(commonTypes.DELETE_USER, deleteUserSaga)]);
};

export default commonSagas;
