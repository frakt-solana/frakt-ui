import { takeLatest, all, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';

import { loansActions } from './actions';
import { LiquidityPoolsResponse, LoanView } from './types';

const loanChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('loans', (response) => emit(response || []));
    return () => socket.off('loans');
  });

const lendingChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('lending', (response) => emit(response));
    return () => socket.off('lending');
  });

const loanSaga = function* (loans: LoanView[]) {
  yield put(loansActions.setLoans(loans));
};

const lendingsSaga = function* (liquidityPools: LiquidityPoolsResponse) {
  yield put(
    loansActions.setLending({
      priceBased: liquidityPools.priceBased,
      timeBased: liquidityPools.timeBased?.[0] || null,
    }),
  );
};

const loansSagas = (socket: Socket) =>
  function* (): Generator {
    const loanStream: any = yield call(loanChannel, socket);
    const lendingStream: any = yield call(lendingChannel, socket);

    yield all([takeLatest(loanStream, loanSaga)]);
    yield all([takeLatest(lendingStream, lendingsSaga)]);
  };

export default loansSagas;
