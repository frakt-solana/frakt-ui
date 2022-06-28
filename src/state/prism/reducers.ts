import { createReducer } from 'typesafe-actions';
import {
  AsyncState,
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state';
import { prismTypes } from './actions';
import { PrismState } from './types';

export const initialPrismState: AsyncState<any> =
  createInitialAsyncState<PrismState>(null);

export const fetchPrismReducer = createReducer(
  initialPrismState,
  createHandlers(prismTypes.FETCH_PRISM),
);

export { fetchPrismReducer as default };
