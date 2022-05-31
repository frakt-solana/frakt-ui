import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { initialAsyncState, createHandlers } from '../../utils/state/reducers';
import { commonTypes } from '../../state/common/actions';

export const initialNotificationState = { isVisible: false, config: null };

const fetchSolanaHealthReducer = createReducer(
  initialAsyncState,
  createHandlers(commonTypes.FETCH_SOLANA_HEALTH, commonTypes),
);
const setNotificationReducer = createReducer(initialNotificationState, {
  [commonTypes.SET_NOTIFICATION]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
});

export default combineReducers({
  fetchSolanaHealth: fetchSolanaHealthReducer,
  notification: setNotificationReducer,
});
