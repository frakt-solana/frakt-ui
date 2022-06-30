import { all, call } from 'redux-saga/effects';

import commonSagas from './common/sagas';
import tokenListSagas from './tokenList/sagas';
import userTokensSagas from './userTokens/sagas';
import liquidationsSagas from './liquidations/sagas';
import prismSagas from './prism/sagas';
import statsSagas from './stats/sagas';

export default function* rootSaga(): Generator {
  yield all([
    call(commonSagas),
    call(tokenListSagas),
    call(userTokensSagas),
    call(liquidationsSagas),
    call(prismSagas),
    call(statsSagas),
  ]);
}
