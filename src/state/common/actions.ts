import { Connection } from '@solana/web3.js';
import { createCustomAction } from 'typesafe-actions';

import { ServerError } from '../../utils/state';
import { NotificationPayload, SolanaHealthResponse } from './types';

export const commonTypes = {
  APP_INIT: 'common/APP_INIT',
  SET_CONNECTION: 'common/SET_CONNECTION',
  SET_NOTIFICATION: 'common/SET_NOTIFICATION',
  FETCH_SOLANA_HEALTH: 'common/FETCH_SOLANA_HEALTH',
  FETCH_SOLANA_HEALTH__PENDING: 'common/FETCH_SOLANA_HEALTH__PENDING',
  FETCH_SOLANA_HEALTH__FULFILLED: 'common/FETCH_SOLANA_HEALTH__FULFILLED',
  FETCH_SOLANA_HEALTH__FAILED: 'common/FETCH_SOLANA_HEALTH__FAILED',
  FETCH_SOLANA_TIMESTAMP: 'common/FETCH_SOLANA_TIMESTAMP',
  FETCH_SOLANA_TIMESTAMP__PENDING: 'common/FETCH_SOLANA_TIMESTAMP__PENDING',
  FETCH_SOLANA_TIMESTAMP__FULFILLED: 'common/FETCH_SOLANA_TIMESTAMP__FULFILLED',
  FETCH_SOLANA_TIMESTAMP__FAILED: 'common/FETCH_SOLANA_TIMESTAMP__FAILED',
};

export const commonActions = {
  appInit: createCustomAction(commonTypes.APP_INIT, () => null),
  setConnection: createCustomAction(
    commonTypes.SET_CONNECTION,
    (connection: Connection) => ({ payload: connection }),
  ),
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
  fetchSolanaTimestamp: createCustomAction(
    commonTypes.FETCH_SOLANA_TIMESTAMP,
    () => null,
  ),
  fetchSolanaTimestampPending: createCustomAction(
    commonTypes.FETCH_SOLANA_TIMESTAMP__PENDING,
    () => null,
  ),
  fetchSolanaTimestampFulfilled: createCustomAction(
    commonTypes.FETCH_SOLANA_TIMESTAMP__FULFILLED,
    (timestamp: number) => ({ payload: timestamp }),
  ),
  fetchSolanaTimestampFailed: createCustomAction(
    commonTypes.FETCH_SOLANA_TIMESTAMP__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
};
