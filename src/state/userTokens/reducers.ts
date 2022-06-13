import { createReducer } from 'typesafe-actions';
import { combineReducers } from 'redux';
import { flip, reject, includes, compose, prop } from 'ramda';

const includesIn = flip(includes);

import {
  initialAsyncState,
  createHandlers,
  composeReducers,
} from '../../utils/state/reducers';
import { userTokensTypes } from './actions';

export const initialBorrowNftsState = { data: [] };

const fetchUserTokensReducer = createReducer(
  initialAsyncState,
  createHandlers(userTokensTypes.FETCH_USER_TOKENS),
);

const fetchWalletNftsReducer = createReducer(
  initialAsyncState,
  createHandlers(userTokensTypes.FETCH_WALLET_NFTS),
);

const setBorrowNftsReducer = createReducer(initialBorrowNftsState, {
  [userTokensTypes.SET_BORROW_NFTS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
});

const removeTokenOptimisticReducer = createReducer(initialAsyncState, {
  [userTokensTypes.REMOVE_TOKEN_OPTIMISTIC]: (state, action) => ({
    ...state,
    data: reject(compose(includesIn(action.payload), prop('mint')), state.data),
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
  borrowNfts: composeReducers(
    setBorrowNftsReducer,
    removeTokenOptimisticReducer,
  ),
});
