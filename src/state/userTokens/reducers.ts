import { createReducer } from 'typesafe-actions';
import { combineReducers } from 'redux';
import { flip, reject, includes, compose, prop } from 'ramda';

import {
  createHandlers,
  composeReducers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { userTokensActions, userTokensTypes } from './actions';
import { BorrowNftsState, UserNFT } from './types';
import { AsyncState } from '../../utils/state';
import { TokenView } from '../../utils/accounts';

const includesIn = flip(includes);

export const initialBorrowNftsState: BorrowNftsState = { data: [] };
export const initialUserTokensState: AsyncState<TokenView[]> =
  createInitialAsyncState<TokenView[]>(null);
export const initialWalletNfts: AsyncState<UserNFT[]> =
  createInitialAsyncState<UserNFT[]>(null);

const fetchUserTokensReducer = createReducer(
  initialUserTokensState,
  createHandlers<TokenView[]>(userTokensTypes.FETCH_USER_TOKENS),
);

const fetchWalletNftsReducer = createReducer(
  initialWalletNfts,
  createHandlers<UserNFT[]>(userTokensTypes.FETCH_WALLET_NFTS),
);

const setBorrowNftsReducer = createReducer<BorrowNftsState>(
  initialBorrowNftsState,
  {
    [userTokensTypes.SET_BORROW_NFTS]: (
      state,
      action: ReturnType<typeof userTokensActions.setBorrowNfts>,
    ) => ({
      ...state,
      data: action.payload,
    }),
  },
);

const removeTokenOptimisticReducer = createReducer<AsyncState<TokenView[]>>(
  initialUserTokensState,
  {
    [userTokensTypes.REMOVE_TOKEN_OPTIMISTIC]: (
      state,
      action: ReturnType<typeof userTokensActions.removeTokenOptimistic>,
    ) => ({
      ...state,
      data: reject(
        compose(includesIn(action.payload), prop('mint')),
        state.data,
      ),
    }),
  },
);

const clearTokensReducer = createReducer<AsyncState<TokenView[]>>(
  initialUserTokensState,
  {
    [userTokensTypes.CLEAR_TOKENS]: (state) => ({
      ...state,
      ...initialUserTokensState,
    }),
  },
);

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
