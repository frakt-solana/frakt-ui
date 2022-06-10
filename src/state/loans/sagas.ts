import { takeLatest, all, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';
import { loansActions } from './actions';

const loanChannel = (socket) =>
  eventChannel((emit) => {
    socket.on('loans', (response) => emit(response));
    return () => socket.off('loans');
  });

const lendingChannel = (socket) =>
  eventChannel((emit) => {
    socket.on('lending', (response) => emit(response));
    return () => socket.off('lending');
  });

const loanSaga = function* (loans) {
  yield put(loansActions.setLoans(loans));
};

const lendingSaga = function* (lending) {
  yield put(loansActions.setLending(lending));
};

const loansSagas = (socket: Socket) =>
  function* (): Generator {
    const loanStream: any = yield call(loanChannel, socket);
    const lendingStream: any = yield call(lendingChannel, socket);

    yield all([takeLatest(loanStream, loanSaga)]);
    yield all([takeLatest(lendingStream, lendingSaga)]);
  };

export default loansSagas;
