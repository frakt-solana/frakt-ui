import { Connection, PublicKey } from '@solana/web3.js';
import { Socket } from 'socket.io-client';
import { createCustomAction } from 'typesafe-actions';

import { ServerError } from '../../utils/state';
import {
  NotificationState,
  WalletModalState,
  SolanaHealthState,
} from './types';

export const commonTypes = {
  APP_INIT: 'common/APP_INIT',
  SET_CONNECTION: 'common/SET_CONNECTION',
  SET_SOCKET: 'common/SET_SOCKET',
  SET_WALLET: 'common/SET_WALLET',
  SET_NOTIFICATION: 'common/SET_NOTIFICATION',
  SET_WALLET_MODAL: 'common/SET_WALLET_MODAL',
  TOGGLE_WALLET_MODAL: 'common/TOGGLE_WALLET_MODAL',
  SEND_FCM_TOKEN: 'common/SEND_FCM_TOKEN',
  FETCH_SOLANA_HEALTH: 'common/FETCH_SOLANA_HEALTH',
  FETCH_SOLANA_HEALTH__PENDING: 'common/FETCH_SOLANA_HEALTH__PENDING',
  FETCH_SOLANA_HEALTH__FULFILLED: 'common/FETCH_SOLANA_HEALTH__FULFILLED',
  FETCH_SOLANA_HEALTH__FAILED: 'common/FETCH_SOLANA_HEALTH__FAILED',
  FETCH_SOLANA_TIMESTAMP: 'common/FETCH_SOLANA_TIMESTAMP',
  FETCH_SOLANA_TIMESTAMP__PENDING: 'common/FETCH_SOLANA_TIMESTAMP__PENDING',
  FETCH_SOLANA_TIMESTAMP__FULFILLED: 'common/FETCH_SOLANA_TIMESTAMP__FULFILLED',
  FETCH_SOLANA_TIMESTAMP__FAILED: 'common/FETCH_SOLANA_TIMESTAMP__FAILED',
  DELETE_USER: 'common/DELETE_USER',
  FETCH_USER: 'common/FETCH_USER',
  FETCH_USER__PENDING: 'common/FETCH_USER__PENDING',
  FETCH_USER__FULFILLED: 'common/FETCH_USER__FULFILLED',
  FETCH_USER__FAILED: 'common/FETCH_USER__FAILED',
  TOGGLE_DISCORD_MODAL: 'common/TOGGLE_DISCORD_MODAL',
};

export const commonActions = {
  appInit: createCustomAction(commonTypes.APP_INIT, () => null),
  setConnection: createCustomAction(
    commonTypes.SET_CONNECTION,
    (connection: Connection) => ({ payload: connection }),
  ),
  setSocket: createCustomAction(commonTypes.SET_SOCKET, (socket: Socket) => ({
    payload: socket,
  })),
  setWallet: createCustomAction(
    commonTypes.SET_WALLET,
    (payload: { publicKey: PublicKey; wallet }) => ({
      payload,
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
  sendFcmToken: createCustomAction(
    commonTypes.SEND_FCM_TOKEN,
    (token: string) => ({ payload: token }),
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
    (payload: SolanaHealthState) => ({ payload }),
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
  deleteUser: createCustomAction(commonTypes.DELETE_USER, (publicKey) => ({
    payload: publicKey,
  })),
  fetchUser: createCustomAction(commonTypes.FETCH_USER, (publicKey) => ({
    payload: publicKey,
  })),
  fetchUserPending: createCustomAction(
    commonTypes.FETCH_USER__PENDING,
    () => null,
  ),
  fetchUserFulfilled: createCustomAction(
    commonTypes.FETCH_USER__FULFILLED,
    (data) => ({ payload: data }),
  ),
  fetchUserFailed: createCustomAction(
    commonTypes.FETCH_USER__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  toggleDiscordModal: createCustomAction(
    commonTypes.TOGGLE_DISCORD_MODAL,
    () => null,
  ),
};
