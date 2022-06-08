import { createCustomAction } from 'typesafe-actions';

import { UserNFT } from './types';
import { ServerError } from '../../utils/state';

export const userTokensTypes = {
  FETCH_USER_TOKENS: 'userTokens/FETCH_USER_TOKENS',
  FETCH_USER_TOKENS__PENDING: 'userTokens/FETCH_USER_TOKENS__PENDING',
  FETCH_USER_TOKENS__FULFILLED: 'userTokens/FETCH_USER_TOKENS__FULFILLED',
  FETCH_USER_TOKENS__FAILED: 'userTokens/FETCH_USER_TOKENS__FAILED',
  FETCH_WALLET_NFTS: 'userTokens/FETCH_WALLET_NFTS',
  FETCH_WALLET_NFTS__PENDING: 'userTokens/FETCH_WALLET_NFTS__PENDING',
  FETCH_WALLET_NFTS__FULFILLED: 'userTokens/FETCH_WALLET_NFTS__FULFILLED',
  FETCH_WALLET_NFTS__FAILED: 'userTokens/FETCH_WALLET_NFTS__FAILED',
  REMOVE_TOKEN_OPTIMISTIC: 'userTokens/REMOVE_TOKEN_OPTIMISTIC',
  CLEAR_TOKENS: 'userTokens/CLEAR_TOKENS',
};

export const userTokensActions = {
  fetchUserTokens: createCustomAction(
    userTokensTypes.FETCH_USER_TOKENS,
    (publicKey) => ({ payload: publicKey }),
  ),
  fetchUserTokensPending: createCustomAction(
    userTokensTypes.FETCH_USER_TOKENS__PENDING,
    () => null,
  ),
  fetchUserTokensFulfilled: createCustomAction(
    userTokensTypes.FETCH_USER_TOKENS__FULFILLED,
    (response: UserNFT[]) => ({ payload: response }),
  ),
  fetchUserTokensFailed: createCustomAction(
    userTokensTypes.FETCH_USER_TOKENS__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  fetchWalletNfts: createCustomAction(
    userTokensTypes.FETCH_WALLET_NFTS,
    () => null,
  ),
  fetchWalletNftsPending: createCustomAction(
    userTokensTypes.FETCH_WALLET_NFTS__PENDING,
    () => null,
  ),
  fetchWalletNftsFulfilled: createCustomAction(
    userTokensTypes.FETCH_WALLET_NFTS__FULFILLED,
    (response: UserNFT[]) => ({ payload: response }),
  ),
  fetchWalletNftsFailed: createCustomAction(
    userTokensTypes.FETCH_WALLET_NFTS__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  removeTokenOptimistic: createCustomAction(
    userTokensTypes.REMOVE_TOKEN_OPTIMISTIC,
    (mints: string[]) => ({ payload: mints }),
  ),
  clearTokens: createCustomAction(userTokensTypes.CLEAR_TOKENS, () => null),
};
