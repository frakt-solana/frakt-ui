import { Prism } from '@prism-hq/prism-ag';
import { all, put, select, takeLatest } from 'redux-saga/effects';

import { selectConnection, selectWalletPublicKey } from '../common/selectors';
import { selectTokenList } from '../tokenList/selectors';
import { prismActions, prismTypes } from './actions';

const fetchPrismSaga = function* () {
  yield put(prismActions.fetchPrismPending());
  try {
    const connection = yield select(selectConnection);
    const tokensList = yield select(selectTokenList);
    const walletPublicKey = yield select(selectWalletPublicKey);

    const data = yield Prism.init({
      connection: connection,
      tokenList: { tokens: tokensList },
      user: walletPublicKey,
    });
    yield put(prismActions.fetchPrismFulfilled(data));
  } catch (error) {
    yield put(prismActions.fetchPrismFailed(error));
  }
};

const prismSagas = function* (): Generator {
  yield all([takeLatest(prismTypes.FETCH_PRISM, fetchPrismSaga)]);
};

export default prismSagas;
