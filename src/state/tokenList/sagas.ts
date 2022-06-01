import { all, call, takeLatest, put } from 'redux-saga/effects';

import { tokenListTypes, tokenListActions } from './actions';
import { networkRequest } from '../../utils/state';

const fetchTokenListSaga = function* () {
  yield put(tokenListActions.fetchTokenListPending());
  try {
    const data = yield call(networkRequest, {
      url: process.env.SOLANA_TOKENS_LIST,
    });
    yield put(tokenListActions.fetchTokenListFulfilled(data));
  } catch (error) {
    yield put(tokenListActions.fetchTokenListFailed(error));
  }
};

const tokenListSagas = function* (): Generator {
  yield all([takeLatest(tokenListTypes.FETCH_TOKEN_LIST, fetchTokenListSaga)]);
};

export default tokenListSagas;
