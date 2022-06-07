import { takeLatest, all, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';
import { loansActions } from './actions';

const loanChannel = (socket) =>
  eventChannel((emit) => {
    socket.on('loans', (response) => emit(response));
    return () => socket.off('loans');
  });

const loanSaga = function* (loans) {
  yield put(loansActions.setLoans(loans));
};

const loansSagas = (socket: Socket) =>
  function* (): Generator {
    const loanStream: any = yield call(loanChannel, socket);
    yield all([takeLatest(loanStream, loanSaga)]);
  };

export default loansSagas;
