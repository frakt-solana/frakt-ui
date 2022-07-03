import { createReducer } from 'typesafe-actions';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { statsTypes } from './actions';
import { StatsState } from './types';

export const initialTokenListState: AsyncState<StatsState> =
  createInitialAsyncState<StatsState>(null);

const fetchStatsReducer = createReducer(
  initialTokenListState,
  createHandlers<StatsState>(statsTypes.FETCH_STATS),
);

export { fetchStatsReducer as default };
