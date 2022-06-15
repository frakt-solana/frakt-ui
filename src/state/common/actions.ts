import { web3 } from '@frakt-protocol/frakt-sdk';
import { Socket } from 'socket.io-client';
import { createCustomAction } from 'typesafe-actions';

import { ServerError } from '../../utils/state';
import {
  SolanaHealthResponse,
  NotificationState,
  WalletModalState,
} from './types';

export const commonTypes = {
  APP_INIT: 'common/APP_INIT',
  SET_CONNECTION: 'common/SET_CONNECTION',
  SET_SOCKET: 'common/SET_SOCKET',
  SET_WALLET: 'common/SET_WALLET',
  SET_NOTIFICATION: 'common/SET_NOTIFICATION',
  SET_WALLET_MODAL: 'common/SET_WALLET_MODAL',
  TOGGLE_WALLET_MODAL: 'common/TOGGLE_WALLET_MODAL',
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
    (connection: web3.Connection) => ({ payload: connection }),
  ),
  setSocket: createCustomAction(commonTypes.SET_SOCKET, (socket: Socket) => ({
    payload: socket,
  })),
  setWallet: createCustomAction(
    commonTypes.SET_WALLET,
    (wallet: { publicKey: web3.PublicKey }) => ({
      payload: wallet,
    }),
  ),
  setNotification: createCustomAction(
    commonTypes.SET_NOTIFICATION,
    (payload: NotificationState) => ({ payload }),
  ),
  setWalletModal: createCustomAction(
    commonTypes.SET_WALLET_MODAL,
    (payload: WalletModalState) => ({ payload }),
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
