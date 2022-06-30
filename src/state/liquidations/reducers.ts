import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { liquidationsTypes } from './actions';
import { GraceListItem } from './types';

export const initialGraceListState: AsyncState<GraceListItem[]> =
  createInitialAsyncState<GraceListItem[]>(null);

const fetchGraceListReducer = createReducer(
  initialGraceListState,
  createHandlers<GraceListItem[]>(liquidationsTypes.FETCH_GRACE_LIST),
);

export default combineReducers({
  graceList: fetchGraceListReducer,
});
