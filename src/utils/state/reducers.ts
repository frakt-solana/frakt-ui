import { ActionType, StateType } from 'typesafe-actions';
import { Reducer } from 'redux';

import { RequestStatus } from './types';

export const initialAsyncState = {
  data: null,
  status: RequestStatus.IDLE,
  messages: [],
};

export const createHandlers = <T>(
  request: string,
): { [key: string]: Reducer<typeof initialAsyncState> } => ({
  [`${request}__PENDING`]: (state: StateType<typeof initialAsyncState>) => ({
    ...state,
    status: RequestStatus.PENDING,
    messages: initialAsyncState.messages,
  }),
  [`${request}__CANCELLED`]: (state: StateType<typeof initialAsyncState>) => ({
    ...state,
    status: RequestStatus.IDLE,
  }),
  [`${request}__RESET`]: (state: StateType<typeof initialAsyncState>) => ({
    ...state,
    data: initialAsyncState.data,
  }),
  [`${request}__FULFILLED`]: (
    state: StateType<typeof initialAsyncState>,
    action: ActionType<T>,
  ) => ({
    ...state,
    status: RequestStatus.FULFILLED,
    data: action.payload,
  }),
  [`${request}__FAILED`]: (
    state: StateType<typeof initialAsyncState>,
    action: ActionType<T>,
  ) => ({
    ...state,
    status: RequestStatus.FAILED,
    messages: action.payload,
  }),
});

export const composeReducers = (...funcs: Reducer[]): Reducer => {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(
    (a, b) =>
      (value, ...rest) =>
        a(b(value, ...rest), ...rest),
  );
};
