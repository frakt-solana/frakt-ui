import { createReducer } from 'typesafe-actions';
import { combineReducers } from 'redux';
import { flip, reject, includes } from 'ramda';

import {
  initialAsyncState,
  createHandlers,
  composeReducers,
} from '../../utils/state/reducers';
import { userTokensTypes } from './actions';

const fetchUserTokensReducer = createReducer(
  initialAsyncState,
  createHandlers(userTokensTypes.FETCH_USER_TOKENS),
);

const fetchWalletNftsReducer = createReducer(
  initialAsyncState,
  createHandlers(userTokensTypes.FETCH_WALLET_NFTS),
);

const removeTokenOptimisticReducer = createReducer(initialAsyncState, {
  [userTokensTypes.REMOVE_TOKEN_OPTIMISTIC]: (state, action) => ({
    ...state,
    data: reject(flip(includes)(action.payload), state.data),
  }),
});

const clearTokensReducer = createReducer(initialAsyncState, {
  [userTokensTypes.CLEAR_TOKENS]: (state) => ({
    ...state,
    ...initialAsyncState,
  }),
});

export default combineReducers({
  userTokens: composeReducers(
    fetchUserTokensReducer,
    removeTokenOptimisticReducer,
    clearTokensReducer,
  ),
  walletNfts: composeReducers(
    fetchWalletNftsReducer,
    removeTokenOptimisticReducer,
    clearTokensReducer,
  ),
});