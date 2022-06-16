import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { AsyncState } from '../../utils/state';

import { createInitialAsyncState } from '../../utils/state/reducers';
import { loansActions, loansTypes } from './actions';
import { BorrowNft, LiquidityPoolsState, LoanView } from './types';

export const initialLoansState: AsyncState<LoanView[]> =
  createInitialAsyncState<LoanView[]>(null);
export const initialLendingState: AsyncState<LiquidityPoolsState> =
  createInitialAsyncState<LiquidityPoolsState>(null);

const setLoansReducer = createReducer<AsyncState<LoanView[]>>(
  initialLoansState,
  {
    [loansTypes.SET_LOANS]: (
      state,
      action: ReturnType<typeof loansActions.setLoans>,
    ) => ({
      ...state,
      data: action.payload,
    }),
  },
);

const setLendingsReducer = createReducer<AsyncState<LiquidityPoolsState>>(
  initialLendingState,
  {
    [loansTypes.SET_LENDINGS]: (
      state,
      action: ReturnType<typeof loansActions.setLending>,
    ) => ({
      ...state,
      data: action.payload,
    }),
  },
);

const setBorrowNftsReducer = createReducer<BorrowNft[]>(null, {
  [loansTypes.SET_BORROW_NFTS]: (
    __,
    action: ReturnType<typeof loansActions.setBorrowNfts>,
  ) => action.payload,
});

const addHiddenBorrowNftsReducer = createReducer<string[]>([], {
  [loansTypes.ADD_HIDDEN_BORROW_NFT]: (
    state,
    action: ReturnType<typeof loansActions.addHiddenBorrowNftMint>,
  ) => [...state, action.payload],
});

export default combineReducers({
  loans: setLoansReducer,
  lendings: setLendingsReducer,
  borrowNfts: setBorrowNftsReducer,
  hiddenBorrowNfts: addHiddenBorrowNftsReducer,
});
