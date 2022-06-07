import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { initialAsyncState } from '../../utils/state/reducers';

import { loansTypes } from './actions';

const setLoansReducer = createReducer(initialAsyncState, {
  [loansTypes.SET_LOANS]: (state, action) => ({
    ...state,
    data: action.payload,
  }),
});

export default combineReducers({
  list: setLoansReducer,
});
