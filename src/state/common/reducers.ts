import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { initialAsyncState, createHandlers } from '../../utils/state/reducers';
import { commonTypes } from '../../state/common/actions';

export const initialConnectionState = { connection: null };
export const initialNotificationState = { isVisible: false, config: null };

const fetchSolanaHealthReducer = createReducer(
  initialAsyncState,
  createHandlers(commonTypes.FETCH_SOLANA_HEALTH, commonTypes),
);
const fetchSolanaTimestampReducer = createReducer(
  initialAsyncState,
  createHandlers(commonTypes.FETCH_SOLANA_TIMESTAMP, commonTypes),
);
const setConnectionReducer = createReducer(initialConnectionState, {
  [commonTypes.SET_CONNECTION]: (state, action) => ({
    ...state,
    connection: action.payload,
  }),
});
const setNotificationReducer = createReducer(initialNotificationState, {
  [commonTypes.SET_NOTIFICATION]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
});

export default combineReducers({
  connection: setConnectionReducer,
  fetchSolanaHealth: fetchSolanaHealthReducer,
  fetchSolanaTimestamp: fetchSolanaTimestampReducer,
  notification: setNotificationReducer,
});
