import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import { getAllUserTokens } from '../../utils/accounts';
import { selectConnection } from '../common/selectors';
import { userTokensTypes, userTokensActions } from './actions';
import { selectRawUserTokensByMint } from './selectors';
import { fetchWalletNFTsUsingArweave } from './helpers';

const fetchUserTokensSaga = function* (action) {
  yield put(userTokensActions.fetchUserTokensPending());
  try {
    const connection = yield select(selectConnection);
    const data = yield call(getAllUserTokens, {
      walletPublicKey: action.payload,
      connection,
    });
    yield put(userTokensActions.fetchUserTokensFulfilled(data));
  } catch (error) {
    yield put(userTokensActions.fetchUserTokensFailed(error));
  }
};

const fetchWalletNftsSaga = function* () {
  yield put(userTokensActions.fetchWalletNftsPending());
  try {
    const connection = yield select(selectConnection);
    const rawUserTokensByMint = yield select(selectRawUserTokensByMint);
    const data = yield call(
      fetchWalletNFTsUsingArweave,
      rawUserTokensByMint,
      connection,
    );
    yield put(userTokensActions.fetchWalletNftsFulfilled(data));
  } catch (error) {
    yield put(userTokensActions.fetchWalletNftsFailed(error));
  }
};

const userTokensSagas = function* (): Generator {
  yield all([
    takeLatest(userTokensTypes.FETCH_USER_TOKENS, fetchUserTokensSaga),
  ]);
  yield all([
    takeLatest(userTokensTypes.FETCH_WALLET_NFTS, fetchWalletNftsSaga),
  ]);
};

export default userTokensSagas;
