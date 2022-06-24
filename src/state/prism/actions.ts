import { Prism } from '@prism-hq/prism-ag';
import { createCustomAction } from 'typesafe-actions';
import { ServerError } from '../../utils/state';

export const prismTypes = {
  FETCH_PRISM: 'prism/FETCH_PRISM',
  FETCH_PRISM__PENDING: 'prism/FETCH_PRISM__PENDING',
  FETCH_PRISM__FULFILLED: 'prism/FETCH_PRISM__FULFILLED',
  FETCH_PRISM__FAILED: 'prism/FETCH_PRISM__FAILED',
};

export const prismActions = {
  fetchPrism: createCustomAction(prismTypes.FETCH_PRISM, () => null),
  fetchPrismPending: createCustomAction(
    prismTypes.FETCH_PRISM__PENDING,
    () => null,
  ),
  fetchPrismFulfilled: createCustomAction(
    prismTypes.FETCH_PRISM__FULFILLED,
    (response: Prism) => ({ payload: response }),
  ),
  fetchPrismFailed: createCustomAction(
    prismTypes.FETCH_PRISM__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
};
