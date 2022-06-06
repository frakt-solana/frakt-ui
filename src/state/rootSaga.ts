import { all, call } from 'redux-saga/effects';

import commonSagas from './common/sagas';
import tokenListSagas from './tokenList/sagas';
import userTokensSagas from './userTokens/sagas';

export default function* rootSaga(): Generator {
  yield all([call(commonSagas), call(tokenListSagas), call(userTokensSagas)]);
}
