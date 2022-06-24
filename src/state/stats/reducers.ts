import { createReducer } from 'typesafe-actions';
import {
  AsyncState,
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state';
import { statsTypes } from './actions';
import { Stats } from './types';

export const initialStatsState: AsyncState<any> =
  createInitialAsyncState<Stats>(null);

export const fetchStatsReducer = createReducer(
  initialStatsState,
  createHandlers(statsTypes.FETCH_STATS),
);

export { fetchStatsReducer as default };
