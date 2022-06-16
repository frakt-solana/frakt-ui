import { AsyncState } from './../../utils/state/types';
import { commonActions } from './actions';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import {
  createHandlers,
  composeReducers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { commonTypes } from '../../state/common/actions';
import {
  ConnectionState,
  NotificationState,
  SocketState,
  SolanaHealthState,
  SolanaNetworkHealth,
  WalletModalState,
  WalletState,
} from './types';

export const initialSolanaHealthState: AsyncState<SolanaHealthState> =
  createInitialAsyncState<SolanaHealthState>({
    health: SolanaNetworkHealth.Good,
    loss: 0,
  });
export const initialFetchSolanaTimestampState: AsyncState<number> =
  createInitialAsyncState<number>(null);
export const initialConnectionState: ConnectionState = { connection: null };
export const initialSocketState: SocketState = { socket: null };
export const initialWalletState: WalletState = {
  wallet: {
    publicKey: null,
  },
};
export const initialNotificationState: NotificationState = {
  isVisible: false,
  config: null,
};
export const initialWalletModalState: WalletModalState = { isVisible: false };

const solanaHealthReducer = createReducer(
  initialSolanaHealthState,
  createHandlers<SolanaHealthState>(commonTypes.FETCH_SOLANA_HEALTH),
);
const fetchSolanaTimestampReducer = createReducer(
  initialFetchSolanaTimestampState,
  createHandlers<number>(commonTypes.FETCH_SOLANA_TIMESTAMP),
);
const setConnectionReducer = createReducer<ConnectionState>(
  initialConnectionState,
  {
    [commonTypes.SET_CONNECTION]: (
      state,
      action: ReturnType<typeof commonActions.setConnection>,
    ) => ({
      ...state,
      connection: action.payload,
    }),
  },
);
const setSocketReducer = createReducer<SocketState>(initialSocketState, {
  [commonTypes.SET_SOCKET]: (
    state,
    action: ReturnType<typeof commonActions.setSocket>,
  ) => ({
    ...state,
    socket: action.payload,
  }),
});
const setWalletReducer = createReducer<WalletState>(initialWalletState, {
  [commonTypes.SET_WALLET]: (
    state,
    action: ReturnType<typeof commonActions.setWallet>,
  ) => ({
    ...state,
    wallet: action.payload,
  }),
});
const setNotificationReducer = createReducer<NotificationState>(
  initialNotificationState,
  {
    [commonTypes.SET_NOTIFICATION]: (
      state,
      action: ReturnType<typeof commonActions.setNotification>,
    ) => ({
      ...state,
      ...action.payload,
    }),
  },
);
const setWalletModalReducer = createReducer<WalletModalState>(
  initialWalletModalState,
  {
    [commonTypes.SET_WALLET_MODAL]: (
      state,
      action: ReturnType<typeof commonActions.setWalletModal>,
    ) => ({
      ...state,
      ...action.payload,
    }),
  },
);
const toggleWalletModalReducer = createReducer<WalletModalState>(
  initialWalletModalState,
  {
    [commonTypes.TOGGLE_WALLET_MODAL]: (state) => ({
      isVisible: !state.isVisible,
    }),
  },
);

export default combineReducers({
  connection: setConnectionReducer,
  socket: setSocketReducer,
  wallet: setWalletReducer,
  solanaHealth: solanaHealthReducer,
  fetchSolanaTimestamp: fetchSolanaTimestampReducer,
  notification: setNotificationReducer,
  walletModal: composeReducers(setWalletModalReducer, toggleWalletModalReducer),
});
