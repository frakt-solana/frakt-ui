import { TokenInfo } from '@frakt-protocol/frakt-sdk';
import { createCustomAction } from 'typesafe-actions';

import { ServerError } from '../../utils/state';

export const tokenListTypes = {
  FETCH_TOKEN_LIST: 'tokenList/FETCH_TOKEN_LIST',
  FETCH_TOKEN_LIST__PENDING: 'tokenList/FETCH_TOKEN_LIST__PENDING',
  FETCH_TOKEN_LIST__FULFILLED: 'tokenList/FETCH_TOKEN_LIST__FULFILLED',
  FETCH_TOKEN_LIST__FAILED: 'tokenList/FETCH_TOKEN_LIST__FAILED',
};

export const tokenListActions = {
  fetchTokenList: createCustomAction(
    tokenListTypes.FETCH_TOKEN_LIST,
    () => null,
  ),
  fetchTokenListPending: createCustomAction(
    tokenListTypes.FETCH_TOKEN_LIST__PENDING,
    () => null,
  ),
  fetchTokenListFulfilled: createCustomAction(
    tokenListTypes.FETCH_TOKEN_LIST__FULFILLED,
    (response: TokenInfo[]) => ({ payload: response }),
  ),
  fetchTokenListFailed: createCustomAction(
    tokenListTypes.FETCH_TOKEN_LIST__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
};
