import { Reducer } from 'redux';

import { AsyncState, RequestStatus } from './types';

export const asyncState: AsyncState<null> = {
  data: null,
  status: RequestStatus.IDLE,
  messages: [],
};

export const createInitialAsyncState = <TData>(
  initialData: TData = null,
): AsyncState<TData> => ({
  data: initialData,
  status: RequestStatus.IDLE,
  messages: [],
});

export const createHandlers = <TData>(
  request: string,
): { [key: string]: Reducer<AsyncState<TData>> } => ({
  [`${request}__PENDING`]: (state: AsyncState<TData>) => ({
    ...state,
    status: RequestStatus.PENDING,
    messages: asyncState.messages,
  }),
  [`${request}__CANCELLED`]: (state: AsyncState<TData>) => ({
    ...state,
    status: RequestStatus.IDLE,
  }),
  [`${request}__RESET`]: (state: AsyncState<TData>) => ({
    ...state,
    data: asyncState.data,
  }),
  [`${request}__FULFILLED`]: (
    state: AsyncState<TData>,
    action: {
      type: string;
      payload: TData;
    },
  ) => ({
    ...state,
    status: RequestStatus.FULFILLED,
    data: action.payload,
  }),
  [`${request}__FAILED`]: (
    state: AsyncState<TData>,
    action: {
      type: string;
      payload: string[];
    },
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
