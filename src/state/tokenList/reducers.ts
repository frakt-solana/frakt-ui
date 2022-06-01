import { createReducer } from 'typesafe-actions';

import { initialAsyncState, createHandlers } from '../../utils/state/reducers';
import { tokenListTypes } from './actions';

const fetchTokenListReducer = createReducer(
  initialAsyncState,
  createHandlers(tokenListTypes.FETCH_TOKEN_LIST),
);

export { fetchTokenListReducer as default };
