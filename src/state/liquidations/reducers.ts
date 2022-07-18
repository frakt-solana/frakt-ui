import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { append } from 'ramda';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { liquidationsTypes } from './actions';
import {
  GraceListItem,
  RaffleListItem,
  WonRaffleListItem,
  CollectionsListItem,
} from './types';

export const initialGraceListState: AsyncState<GraceListItem[]> =
  createInitialAsyncState<GraceListItem[]>(null);

export const initialRaffleListState: AsyncState<RaffleListItem[]> =
  createInitialAsyncState<RaffleListItem[]>(null);

export const initialCollectionsListState: AsyncState<CollectionsListItem[]> =
  createInitialAsyncState<CollectionsListItem[]>(null);

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

const fetchCollectionsListReducer = createReducer(
  initialCollectionsListState,
  createHandlers<CollectionsListItem[]>(
    liquidationsTypes.FETCH_COLLECTIONS_LIST,
  ),
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

const txRaffleTryReducer = createReducer(
  initialTxState,
  createHandlers<unknown>(liquidationsTypes.TX_RAFFLE_TRY),
);

const txLiquidateReducer = createReducer(
  initialTxState,
  createHandlers<unknown>(liquidationsTypes.TX_LIQUIDATE),
);

const ignoreLotteryTicketsListReducer = createReducer([], {
  [liquidationsTypes.TX_RAFFLE_TRY__FULFILLED]: (state, action) =>
    append(action.payload, state),
});

export default combineReducers({
  graceList: fetchGraceListReducer,
  raffleList: fetchRaffleListReducer,
  collectionsList: fetchCollectionsListReducer,
  wonRaffleList: setWonRaffleListReducer,
  lotteryTicketsList: setLotteryTicketsListReducer,
  ignoreLotteryTicketsList: ignoreLotteryTicketsListReducer,
  txRaffleTry: txRaffleTryReducer,
  txLiquidate: txLiquidateReducer,
});
