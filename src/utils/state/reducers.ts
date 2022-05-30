import { ActionType, StateType } from 'typesafe-actions';
import { Reducer } from 'redux';

export const initialAsyncState = {
  data: null,
  status: 'IDLE',
  messages: [],
};

export const createHandlers = <T>(
  request: string,
  types: { [key: string]: string },
): { [key: string]: Reducer<typeof initialAsyncState> } => ({
  [types[`${request}__PENDING`]]: (
    state: StateType<typeof initialAsyncState>,
  ) => ({
    ...state,
    status: 'PENDING',
    messages: initialAsyncState.messages,
  }),
  [types[`${request}__CANCELLED`]]: (
    state: StateType<typeof initialAsyncState>,
  ) => ({
    ...state,
    status: 'IDLE',
  }),
  [types[`${request}__RESET`]]: (
    state: StateType<typeof initialAsyncState>,
  ) => ({
    ...state,
    data: initialAsyncState.data,
  }),
  [types[`${request}__FULFILLED`]]: (
    state: StateType<typeof initialAsyncState>,
    action: ActionType<T>,
  ) => ({
    ...state,
    status: 'FULFILLED',
    data: action.payload,
  }),
  [types[`${request}__FAILED`]]: (
    state: StateType<typeof initialAsyncState>,
    action: ActionType<T>,
  ) => ({
    ...state,
    status: 'FAILED',
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
