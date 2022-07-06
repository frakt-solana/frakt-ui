import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
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

export default combineReducers({
  graceList: fetchGraceListReducer,
  raffleList: fetchRaffleListReducer,
  wonRaffleList: setWonRaffleListReducer,
  lotteryTicketsList: setLotteryTicketsListReducer,
});
