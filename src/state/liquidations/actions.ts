import { createCustomAction } from 'typesafe-actions';

import { GraceListItem, RaffleListItem } from './types';
import { ServerError } from '../../utils/state';

export const liquidationsTypes = {
  FETCH_GRACE_LIST: 'liquidations/FETCH_GRACE_LIST',
  FETCH_GRACE_LIST__PENDING: 'liquidations/FETCH_GRACE_LIST__PENDING',
  FETCH_GRACE_LIST__FULFILLED: 'liquidations/FETCH_GRACE_LIST__FULFILLED',
  FETCH_GRACE_LIST__FAILED: 'liquidations/FETCH_GRACE_LIST__FAILED',
  FETCH_RAFFLE_LIST: 'liquidations/FETCH_RAFFLE_LIST',
  FETCH_RAFFLE_LIST__PENDING: 'liquidations/FETCH_RAFFLE_LIST__PENDING',
  FETCH_RAFFLE_LIST__FULFILLED: 'liquidations/FETCH_RAFFLE_LIST__FULFILLED',
  FETCH_RAFFLE_LIST__FAILED: 'liquidations/FETCH_RAFFLE_LIST__FAILED',
  SET_WON_RAFFLE_LIST: 'liquidations/SET_WON_RAFFLE_LIST',
  SET_LOTTERY_TICKETS_LIST: 'liquidations/SET_LOTTERY_TICKETS_LIST',
  TX_RAFFLE_TRY: 'liquidations/TX_RAFFLE_TRY',
  TX_LIQUIDATE: 'liquidations/TX_LIQUIDATE',
};

export const liquidationsActions = {
  fetchGraceList: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST,
    () => null,
  ),
  fetchGraceListPending: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__PENDING,
    () => null,
  ),
  fetchGraceListFulfilled: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__FULFILLED,
    (response: GraceListItem[]) => ({ payload: response }),
  ),
  fetchGraceListFailed: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  fetchRaffleList: createCustomAction(
    liquidationsTypes.FETCH_RAFFLE_LIST,
    () => null,
  ),
  fetchRaffleListPending: createCustomAction(
    liquidationsTypes.FETCH_RAFFLE_LIST__PENDING,
    () => null,
  ),
  fetchRaffleListFulfilled: createCustomAction(
    liquidationsTypes.FETCH_RAFFLE_LIST__FULFILLED,
    (response: RaffleListItem[]) => ({ payload: response }),
  ),
  fetchRaffleListFailed: createCustomAction(
    liquidationsTypes.FETCH_RAFFLE_LIST__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  setWonRaffleList: createCustomAction(
    liquidationsTypes.SET_WON_RAFFLE_LIST,
    (response) => ({ payload: response }),
  ),
  setLotteryTicketsList: createCustomAction(
    liquidationsTypes.SET_LOTTERY_TICKETS_LIST,
    (response) => ({ payload: response }),
  ),
  txRaffleTry: createCustomAction(
    liquidationsTypes.TX_RAFFLE_TRY,
    (payload) => ({ payload }),
  ),
  txLiquidate: createCustomAction(
    liquidationsTypes.TX_LIQUIDATE,
    (payload) => ({ payload }),
  ),
};
