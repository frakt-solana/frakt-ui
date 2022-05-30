import { createCustomAction } from 'typesafe-actions';

import { ServerError } from '../../utils/state';
import {
  NotificationPayload,
  WalletModalPayload,
  SolanaHealthResponse,
} from './types';

export const commonTypes = {
  APP_INIT: 'common/APP_INIT',
  SET_NOTIFICATION: 'common/SET_NOTIFICATION',
  SET_WALLET_MODAL: 'common/SET_WALLET_MODAL',
  TOGGLE_WALLET_MODAL: 'common/TOGGLE_WALLET_MODAL',
  FETCH_SOLANA_HEALTH: 'common/FETCH_SOLANA_HEALTH',
  FETCH_SOLANA_HEALTH__PENDING: 'common/FETCH_SOLANA_HEALTH__PENDING',
  FETCH_SOLANA_HEALTH__FULFILLED: 'common/FETCH_SOLANA_HEALTH__FULFILLED',
  FETCH_SOLANA_HEALTH__FAILED: 'common/FETCH_SOLANA_HEALTH__FAILED',
};

export const commonActions = {
  appInit: createCustomAction(commonTypes.APP_INIT, () => null),
  setNotification: createCustomAction(
    commonTypes.SET_NOTIFICATION,
    (payload: NotificationPayload) => ({ payload }),
  ),
  setWalletModal: createCustomAction(
    commonTypes.SET_WALLET_MODAL,
    (payload: WalletModalPayload) => ({ payload }),
  ),
  toggleWalletModal: createCustomAction(
    commonTypes.TOGGLE_WALLET_MODAL,
    () => null,
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
