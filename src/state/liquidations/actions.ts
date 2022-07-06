import { createCustomAction } from 'typesafe-actions';

import { GraceListItem, GraceListState } from './types';
import { ServerError } from '../../utils/state';

export const liquidationsTypes = {
  FETCH_GRACE_LIST: 'liquidations/FETCH_GRACE_LIST',
  FETCH_GRACE_LIST__PENDING: 'liquidations/FETCH_GRACE_LIST__PENDING',
  FETCH_GRACE_LIST__FULFILLED: 'liquidations/FETCH_GRACE_LIST__FULFILLED',
  FETCH_GRACE_LIST__FAILED: 'liquidations/FETCH_GRACE_LIST__FAILED',
};

export const liquidationsActions = {
  fetchGraceList: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST,
    (payload?: GraceListState) => ({
      payload,
    }),
  ),
  fetchGraceListPending: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__PENDING,
    () => null,
  ),
  fetchGraceListFulfilled: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__FULFILLED,
    (response: GraceListItem[]) => ({ payload: response }),
  ),
  fetchGraceListFailed: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
};
