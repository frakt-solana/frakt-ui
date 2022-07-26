import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { all, call, takeLatest, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';
import { values, compose, join, reject } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';

import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../../utils/transactions';
import { notify, closeNotification } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { captureSentryError } from '../../utils/sentry';
import { parse } from '../../utils/state/qs';
import { liquidationsTypes, liquidationsActions } from './actions';
import { WonRaffleListItem } from './types';
import { networkRequest } from '../../utils/state';
import {
  selectConnection,
  selectWallet,
  selectWalletPublicKey,
  selectSocket,
} from '../common/selectors';
import { selectLotteryTickets } from './selectors';

const wonRafflesChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('won-raffles', (response) => emit(response));
    return () => socket.off('won-raffles');
  });

const lotteryTicketsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('lottery-tickets', (response) => emit(response));
    return () => socket.off('lottery-tickets');
  });

const fetchGraceListSaga = function* (action) {
  const searchStr = action.payload?.searchStr;
  const sortBy = action.payload?.sortBy;
  const sortOrder = action.payload?.sortOrder;
  const collectionsFilter = action.payload?.collections;

  yield put(liquidationsActions.fetchGraceListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation/grace-list?${searchStr}${sortBy}${sortOrder}${collectionsFilter}limit=1000`,
    });
    yield put(liquidationsActions.fetchGraceListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchGraceListFailed(error));
  }
};

const fetchRaffleListSaga = function* (action) {
  const searchStr = action.payload?.searchStr;
  const sortBy = action.payload?.sortBy;
  const sortOrder = action.payload?.sortOrder;
  const collectionsFilter = action.payload?.collections;

  yield put(liquidationsActions.fetchRaffleListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation?${searchStr}${sortBy}${sortOrder}${collectionsFilter}limit=1000`,
    });
    yield put(liquidationsActions.fetchRaffleListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchRaffleListFailed(error));
  }
};

const updateWonRaffleListSaga = function* (action) {
  const socket = yield select(selectSocket);
  const publicKey = yield select(selectWalletPublicKey);
  const params = compose(
    parse,
    join(''),
    reject(isNilOrEmpty),
    values,
  )(action.payload);
  if (publicKey && socket) {
    socket.emit('won-raffles-subscribe', {
      wallet: publicKey,
      limit: 1000,
      ...params,
    });
  }
};

const fetchCollectionsListSaga = function* () {
  yield put(liquidationsActions.fetchCollectionsListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/collection`,
    });
    yield put(liquidationsActions.fetchCollectionsListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchCollectionsListFailed(error));
  }
};

const txRaffleTrySaga = function* (action) {
  yield put(liquidationsActions.txRaffleTryPending());
  const connection = yield select(selectConnection);
  const publicKey = yield select(selectWalletPublicKey);
  const wallet = yield select(selectWallet);
  const lotteryTickets = yield select(selectLotteryTickets);

  let params;
  let tx;

  if (!lotteryTickets.tickets[0].stakeAccountPubkey) {
    params = {
      connection,
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      admin: new web3.PublicKey(process.env.LOANS_ADMIN_PUBKEY),
      user: publicKey,
      liquidationLot: new web3.PublicKey(action.payload.liquidationLotPubkey),
      attemptsNftMint: new web3.PublicKey(lotteryTickets.tickets[0].nftMint),
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          signers,
        });
      },
    };
    tx = loans.getLotTicket;
  } else {
    params = {
      connection,
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      admin: new web3.PublicKey(process.env.LOANS_ADMIN_PUBKEY),
      user: publicKey,
      liquidationLot: new web3.PublicKey(action.payload.liquidationLotPubkey),
      attemptsNftMint: new web3.PublicKey(lotteryTickets.tickets[0].nftMint),
      fraktNftStake: new web3.PublicKey(
        lotteryTickets.tickets[0].stakeAccountPubkey,
      ),
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          signers,
        });
      },
    };
    tx = loans.getLotTicketByStaking;
  }
  try {
    const lotTicketPubkey = yield call(tx, params);
    yield put(
      liquidationsActions.txRaffleTryFulfilled(
        lotteryTickets.tickets[0].nftMint,
      ),
    );
    const loaderNotificationId = Math.random().toString(36);
    notify({
      message: 'Your ticket is trying to win a raffle...',
      type: NotifyType.INFO,
      persist: true,
      key: loaderNotificationId,
    });
    const subscribtionId = connection.onAccountChange(
      lotTicketPubkey,
      (accountInfo) => {
        const lotAccountData: any = loans.decodeLotTicket(
          accountInfo.data,
          lotTicketPubkey,
          connection,
          new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        );

        if (lotAccountData?.ticketState === 'winning') {
          closeNotification(loaderNotificationId);
          notify({
            message: 'Congratulations! Your ticket has won!',
            type: NotifyType.SUCCESS,
          });
          connection.removeAccountChangeListener(subscribtionId);
        } else if (lotAccountData?.ticketState === 'notWinning') {
          closeNotification(loaderNotificationId);
          notify({
            message: "Ooops. Your ticket didn't win",
            type: NotifyType.ERROR,
          });
          connection.removeAccountChangeListener(subscribtionId);
        }
      },
    );
  } catch (error) {
    yield put(liquidationsActions.txRaffleTryFailed(error));
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'getLotTicket',
      params,
    });
  }
};

const txLiquidateSaga = function* (action) {
  yield put(liquidationsActions.txLiquidatePending());
  const connection = yield select(selectConnection);
  const publicKey = yield select(selectWalletPublicKey);
  const wallet = yield select(selectWallet);

  const params = {
    connection,
    programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
    admin: new web3.PublicKey(process.env.LOANS_ADMIN_PUBKEY),
    user: publicKey,
    liquidityPool: new web3.PublicKey(action.payload.liquidityPool),
    royaltyAddress: new web3.PublicKey(action.payload.royaltyAddress),
    lotTicket: new web3.PublicKey(action.payload.winningLotTicketPubkey),
    collectionInfo: new web3.PublicKey(action.payload.collectionInfo),
    loan: new web3.PublicKey(action.payload.loan),
    liquidationLot: new web3.PublicKey(action.payload.liquidationLotPubkey),
    nftMint: new web3.PublicKey(action.payload.nftMint),
    sendTxn: async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        wallet,
      });
    },
  };
  try {
    yield call(loans.redeemWinningLotTicket, params);
    yield put(liquidationsActions.txLiquidateFulfilled(action.payload.nftMint));
  } catch (error) {
    yield put(liquidationsActions.txLiquidateFailed(error));
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'redeemWinningLotTicket',
      params,
    });
  }
};

const subscribeWonRaffleListSaga = function* (list: WonRaffleListItem[]) {
  yield put(liquidationsActions.setWonRaffleList(list));
};

const subscribeLotteryTicketsSaga = function* (list) {
  yield put(liquidationsActions.setLotteryTicketsList(list));
};

const liquidationsSagas = (socket: Socket) =>
  function* (): Generator {
    const wonRafflesStream: any = yield call(wonRafflesChannel, socket);
    const lotteryTicketsStream: any = yield call(lotteryTicketsChannel, socket);

    yield all([
      takeLatest(liquidationsTypes.FETCH_GRACE_LIST, fetchGraceListSaga),
    ]);
    yield all([
      takeLatest(liquidationsTypes.FETCH_RAFFLE_LIST, fetchRaffleListSaga),
    ]);
    yield all([
      takeLatest(
        liquidationsTypes.UPDATE_WON_RAFFLE_LIST,
        updateWonRaffleListSaga,
      ),
    ]);
    yield all([
      takeLatest(
        liquidationsTypes.FETCH_COLLECTIONS_LIST,
        fetchCollectionsListSaga,
      ),
    ]);
    yield all([takeLatest(liquidationsTypes.TX_RAFFLE_TRY, txRaffleTrySaga)]);
    yield all([takeLatest(liquidationsTypes.TX_LIQUIDATE, txLiquidateSaga)]);
    yield all([takeLatest(wonRafflesStream, subscribeWonRaffleListSaga)]);
    yield all([takeLatest(lotteryTicketsStream, subscribeLotteryTicketsSaga)]);
  };

export default liquidationsSagas;
