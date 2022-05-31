import { createCustomAction } from 'typesafe-actions';

import { ServerError } from '../../utils/state';
import { NotificationPayload, SolanaHealthResponse } from './types';

export const commonTypes = {
  APP_INIT: 'common/APP_INIT',
  SET_NOTIFICATION: 'common/SET_NOTIFICATION',
  FETCH_SOLANA_HEALTH: 'common/FETCH_SOLANA_HEALTH',
  FETCH_SOLANA_HEALTH__PENDING: 'common/FETCH_SOLANA_HEALTH__PENDING',
  FETCH_SOLANA_HEALTH__FULFILLED: 'common/FETCH_SOLANA_HEALTH__FULFILLED',
  FETCH_SOLANA_HEALTH__FAILED: 'common/FETCH_SOLANA_HEALTH__FAILED',
};

export const commonActions = {
  appInit: createCustomAction(commonTypes.APP_INIT, () => null),
  setNotification: createCustomAction(
    commonTypes.SET_NOTIFICATION,
    (data: NotificationPayload) => ({ payload: data }),
  ),
  fetchSolanaHealth: createCustomAction(
    commonTypes.FETCH_SOLANA_HEALTH,
    () => null,
  ),
  fetchSolanaHealthPending: createCustomAction(
    commonTypes.FETCH_SOLANA_HEALTH__PENDING,
    () => null,
  ),
  fetchSolanaHealthFulfilled: createCustomAction(
    commonTypes.FETCH_SOLANA_HEALTH__FULFILLED,
    (response: SolanaHealthResponse[]) => ({ payload: response }),
  ),
  fetchSolanaHealthFailed: createCustomAction(
    commonTypes.FETCH_SOLANA_HEALTH__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
};
