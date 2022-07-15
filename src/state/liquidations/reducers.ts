import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { over, lensPath, without } from 'ramda';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
  composeReducers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { liquidationsTypes } from './actions';
import { GraceListItem, RaffleListItem, WonRaffleListItem } from './types';

export const initialGraceListState: AsyncState<GraceListItem[]> =
  createInitialAsyncState<GraceListItem[]>(null);

export const initialRaffleListState: AsyncState<RaffleListItem[]> =
  createInitialAsyncState<RaffleListItem[]>(null);

export const initialWonRaffleListState: AsyncState<WonRaffleListItem[]> =
  createInitialAsyncState<WonRaffleListItem[]>(null);

export const initialLotteryTicketsListState: AsyncState<any> =
  createInitialAsyncState<any>(null);

export const initialTxState: AsyncState<unknown> =
  createInitialAsyncState<unknown>(null);

const fetchGraceListReducer = createReducer(
  initialGraceListState,
  createHandlers<GraceListItem[]>(liquidationsTypes.FETCH_GRACE_LIST),
);

const fetchRaffleListReducer = createReducer(
  initialRaffleListState,
  createHandlers<RaffleListItem[]>(liquidationsTypes.FETCH_RAFFLE_LIST),
);

const setWonRaffleListReducer = createReducer(initialWonRaffleListState, {
  [liquidationsTypes.SET_WON_RAFFLE_LIST]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
});

const setLotteryTicketsListReducer = createReducer(
  initialLotteryTicketsListState,
  {
    [liquidationsTypes.SET_LOTTERY_TICKETS_LIST]: (state, action) => ({
      ...state,
      data: action.payload,
    }),
  },
);

const txRaffleTryFulfilledReducer = createReducer(
  initialLotteryTicketsListState,
  {
    [liquidationsTypes.TX_RAFFLE_TRY__FULFILLED]: (state, action) =>
      over(lensPath(['data', 'nftMints']), without([action.payload]), state),
  },
);

const txRaffleTryReducer = createReducer(
  initialTxState,
  createHandlers<unknown>(liquidationsTypes.TX_RAFFLE_TRY),
);

const txLiquidateReducer = createReducer(
  initialTxState,
  createHandlers<unknown>(liquidationsTypes.TX_LIQUIDATE),
);

export default combineReducers({
  graceList: fetchGraceListReducer,
  raffleList: fetchRaffleListReducer,
  wonRaffleList: setWonRaffleListReducer,
  lotteryTicketsList: composeReducers(
    setLotteryTicketsListReducer,
    txRaffleTryFulfilledReducer,
  ),
  txRaffleTry: txRaffleTryReducer,
  txLiquidate: txLiquidateReducer,
});
