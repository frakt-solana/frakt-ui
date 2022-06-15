import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import {
  initialAsyncState,
  createHandlers,
  composeReducers,
} from '../../utils/state/reducers';
import { commonTypes } from '../../state/common/actions';
import { ConnectionState, SocketState } from './types';

export const initialConnectionState: ConnectionState = { connection: null };
export const initialSocketState: SocketState = { socket: null };
export const initialWalletState = { wallet: null };
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
const setConnectionReducer = createReducer<ConnectionState>(
  initialConnectionState,
  {
    [commonTypes.SET_CONNECTION]: (state, action) => ({
      ...state,
      connection: action.payload,
    }),
  },
);
const setSocketReducer = createReducer<SocketState>(initialSocketState, {
  [commonTypes.SET_SOCKET]: (state, action) => ({
    ...state,
    socket: action.payload,
  }),
});
const setWalletReducer = createReducer(initialWalletState, {
  [commonTypes.SET_WALLET]: (state, action) => ({
    ...state,
    wallet: action.payload,
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
  socket: setSocketReducer,
  wallet: setWalletReducer,
  fetchSolanaHealth: fetchSolanaHealthReducer,
  fetchSolanaTimestamp: fetchSolanaTimestampReducer,
  notification: setNotificationReducer,
  walletModal: composeReducers(setWalletModalReducer, toggleWalletModalReducer),
});
