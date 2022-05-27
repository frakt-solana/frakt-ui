import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { initialAsyncState, createHandlers } from '../../utils/state/reducers';
import { commonTypes } from '../../state/common/actions';

const fetchSolanaHealthReducer = createReducer(
  initialAsyncState,
  createHandlers('FETCH_SOLANA_HEALTH', commonTypes),
);
const setNotificationReducer = createReducer(
  { isVisible: false, config: null },
  {
    [commonTypes.SET_NOTIFICATION]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
);

export default combineReducers({
  fetchSolanaHealth: fetchSolanaHealthReducer,
  notification: setNotificationReducer,
});
