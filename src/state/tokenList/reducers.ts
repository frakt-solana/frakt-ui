import { createReducer } from 'typesafe-actions';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { tokenListTypes } from './actions';
import { TokenListState } from './types';

export const initialTokenListState: AsyncState<TokenListState> =
  createInitialAsyncState<TokenListState>(null);

const fetchTokenListReducer = createReducer(
  initialTokenListState,
  createHandlers<TokenListState>(tokenListTypes.FETCH_TOKEN_LIST),
);

export { fetchTokenListReducer as default };
