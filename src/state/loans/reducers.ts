import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { AsyncState } from '../../utils/state';

import { createInitialAsyncState } from '../../utils/state/reducers';
import { loansActions, loansTypes } from './actions';
import { Lending, LoanView } from './types';

export const initialLoansState: AsyncState<LoanView[]> =
  createInitialAsyncState<LoanView[]>(null);
export const initialLendingState: AsyncState<Lending> =
  createInitialAsyncState<Lending>(null);

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

const setLendingReducer = createReducer<AsyncState<Lending>>(
  initialLendingState,
  {
    [loansTypes.SET_LENDING]: (
      state,
      action: ReturnType<typeof loansActions.setLending>,
    ) => ({
      ...state,
      data: action.payload,
    }),
  },
);

export default combineReducers({
  loans: setLoansReducer,
  lending: setLendingReducer,
});
