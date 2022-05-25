import { all, call } from 'redux-saga/effects';

import commonSagas from './common/sagas';

export default function* rootSaga() {
  yield all([call(commonSagas)]);
}
