import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import {
  initialAsyncState,
  createHandlers,
  composeReducers,
} from '../../utils/state/reducers';
import { commonTypes } from '../../state/common/actions';

export const initialConnectionState = { connection: null };
export const initialNotificationState = { isVisible: false, config: null };
export const initialWalletModalState = { isVisible: false };

const fetchSolanaHealthReducer = createReducer(
  initialAsyncState,
  createHandlers(commonTypes.FETCH_SOLANA_HEALTH),
);
const fetchSolanaTimestampReducer = createReducer(
  initialAsyncState,
  createHandlers(commonTypes.FETCH_SOLANA_TIMESTAMP),
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
const setWalletModalReducer = createReducer(initialWalletModalState, {
  [commonTypes.SET_WALLET_MODAL]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
});
const toggleWalletModalReducer = createReducer(initialWalletModalState, {
  [commonTypes.TOGGLE_WALLET_MODAL]: (state) => ({
    isVisible: !state.isVisible,
  }),
});

export default combineReducers({
  connection: setConnectionReducer,
  fetchSolanaHealth: fetchSolanaHealthReducer,
  fetchSolanaTimestamp: fetchSolanaTimestampReducer,
  notification: setNotificationReducer,
  walletModal: composeReducers(setWalletModalReducer, toggleWalletModalReducer),
});
