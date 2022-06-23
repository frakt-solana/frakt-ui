import { takeLatest, all, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';

import { loansActions } from './actions';
import { LiquidityPool, Loan } from './types';

const loanChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('loans', (response) => emit(response || []));
    return () => socket.off('loans');
  });

const liquidityPoolsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('lending', (response) => emit(response || []));
    return () => socket.off('lending');
  });

const loansSaga = function* (loans: Loan[]) {
  yield put(loansActions.setLoans(loans));
};

const liquidityPoolsSaga = function* (liquidityPools: LiquidityPool[]) {
  yield put(loansActions.setLiquidityPools(liquidityPools));
};

const loansSagas = (socket: Socket) =>
  function* (): Generator {
    const loansStream: any = yield call(loanChannel, socket);
    const lendingsStream: any = yield call(liquidityPoolsChannel, socket);

    yield all([takeLatest(loansStream, loansSaga)]);
    yield all([takeLatest(lendingsStream, liquidityPoolsSaga)]);
  };

export default loansSagas;
