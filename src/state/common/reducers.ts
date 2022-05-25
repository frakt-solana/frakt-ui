import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { createReducer } from '../../utils/state/reducers';
import { commonTypes } from '../../state/common/actions';

const [, fetchSolanaHealthReducer] = createReducer(
  commonTypes,
  'FETCH_SOLANA_HEALTH',
);
const setNotificationReducer = handleActions(
  {
    [commonTypes.SET_NOTIFICATION]: (state, action: any) => ({
      ...state,
      ...action.payload,
    }),
  },
  { isVisible: false, config: null },
);

export default combineReducers({
  fetchSolanaHealth: fetchSolanaHealthReducer,
  notification: setNotificationReducer,
});
