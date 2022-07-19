import { createCustomAction } from 'typesafe-actions';

import {
  GraceListItem,
  FetchItemsParams,
  RaffleListItem,
  CollectionsListItem,
} from './types';
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
  FETCH_COLLECTIONS_LIST: 'liquidations/FETCH_COLLECTIONS_LIST',
  FETCH_COLLECTIONS_LIST__PENDING:
    'liquidations/FETCH_COLLECTIONS_LIST__PENDING',
  FETCH_COLLECTIONS_LIST__FULFILLED:
    'liquidations/FETCH_COLLECTIONS_LIST__FULFILLED',
  FETCH_COLLECTIONS_LIST__FAILED: 'liquidations/FETCH_COLLECTIONS_LIST__FAILED',
  SET_WON_RAFFLE_LIST: 'liquidations/SET_WON_RAFFLE_LIST',
  UPDATE_WON_RAFFLE_LIST: 'liquidations/UPDATE_WON_RAFFLE_LIST',
  SET_LOTTERY_TICKETS_LIST: 'liquidations/SET_LOTTERY_TICKETS_LIST',
  TX_RAFFLE_TRY: 'liquidations/TX_RAFFLE_TRY',
  TX_RAFFLE_TRY__PENDING: 'liquidations/TX_RAFFLE_TRY__PENDING',
  TX_RAFFLE_TRY__FULFILLED: 'liquidations/TX_RAFFLE_TRY__FULFILLED',
  TX_RAFFLE_TRY__FAILED: 'liquidations/TX_RAFFLE_TRY__FAILED',
  TX_LIQUIDATE: 'liquidations/TX_LIQUIDATE',
  TX_LIQUIDATE__PENDING: 'liquidations/TX_LIQUIDATE__PENDING',
  TX_LIQUIDATE__FULFILLED: 'liquidations/TX_LIQUIDATE__FULFILLED',
  TX_LIQUIDATE__FAILED: 'liquidations/TX_LIQUIDATE__FAILED',
};

export const liquidationsActions = {
  fetchGraceList: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST,
    (params?: FetchItemsParams) => ({ payload: params }),
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
    (params?: FetchItemsParams) => ({ payload: params }),
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
  fetchCollectionsList: createCustomAction(
    liquidationsTypes.FETCH_COLLECTIONS_LIST,
    () => null,
  ),
  fetchCollectionsListPending: createCustomAction(
    liquidationsTypes.FETCH_COLLECTIONS_LIST__PENDING,
    () => null,
  ),
  fetchCollectionsListFulfilled: createCustomAction(
    liquidationsTypes.FETCH_COLLECTIONS_LIST__FULFILLED,
    (response: CollectionsListItem[]) => ({ payload: response }),
  ),
  fetchCollectionsListFailed: createCustomAction(
    liquidationsTypes.FETCH_COLLECTIONS_LIST__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  setWonRaffleList: createCustomAction(
    liquidationsTypes.SET_WON_RAFFLE_LIST,
    (response) => ({ payload: response }),
  ),
  updateWonRaffleList: createCustomAction(
    liquidationsTypes.UPDATE_WON_RAFFLE_LIST,
    (params) => ({ payload: params }),
  ),
  setLotteryTicketsList: createCustomAction(
    liquidationsTypes.SET_LOTTERY_TICKETS_LIST,
    (response) => ({ payload: response }),
  ),
  txRaffleTry: createCustomAction(
    liquidationsTypes.TX_RAFFLE_TRY,
    (payload) => ({ payload }),
  ),
  txRaffleTryPending: createCustomAction(
    liquidationsTypes.TX_RAFFLE_TRY__PENDING,
    () => null,
  ),
  txRaffleTryFulfilled: createCustomAction(
    liquidationsTypes.TX_RAFFLE_TRY__FULFILLED,
    (payload) => ({ payload }),
  ),
  txRaffleTryFailed: createCustomAction(
    liquidationsTypes.TX_RAFFLE_TRY__FAILED,
    (error) => ({ payload: error }),
  ),
  txLiquidate: createCustomAction(
    liquidationsTypes.TX_LIQUIDATE,
    (payload) => ({ payload }),
  ),
  txLiquidatePending: createCustomAction(
    liquidationsTypes.TX_LIQUIDATE__PENDING,
    () => null,
  ),
  txLiquidateFulfilled: createCustomAction(
    liquidationsTypes.TX_LIQUIDATE__FULFILLED,
    (payload) => ({ payload }),
  ),
  txLiquidateFailed: createCustomAction(
    liquidationsTypes.TX_LIQUIDATE__FAILED,
    (error) => ({ payload: error }),
  ),
};
