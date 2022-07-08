import { all, call, takeLatest, put } from 'redux-saga/effects';
import { over, filter, lensProp, propEq, compose, concat } from 'ramda';

import { tokenListTypes, tokenListActions } from './actions';
import { networkRequest } from '../../utils/state';
import { ADDITIONAL_TOKENS } from './constants';

const fetchTokenListSaga = function* () {
  yield put(tokenListActions.fetchTokenListPending());
  try {
    const data = yield call(networkRequest, {
      url: process.env.SOLANA_TOKENS_LIST,
    });

    const filterMainnetTokens = over(
      lensProp<any>('tokens'),
      filter(propEq('chainId', 101)),
    );

    const addNotListedTokens = over(
      lensProp<any>('tokens'),
      concat(ADDITIONAL_TOKENS),
    );

    yield put(
      tokenListActions.fetchTokenListFulfilled(
        compose(addNotListedTokens, filterMainnetTokens)(data),
      ),
    );
  } catch (error) {
    yield put(tokenListActions.fetchTokenListFailed(error));
  }
};

const tokenListSagas = function* (): Generator {
  yield all([takeLatest(tokenListTypes.FETCH_TOKEN_LIST, fetchTokenListSaga)]);
};

export default tokenListSagas;
