import { ActionType, StateType } from 'typesafe-actions';
import { Reducer } from 'redux';

export const initialAsyncState = {
  data: null,
  status: 'IDLE',
  messages: [],
};

export const createHandlers = <T>(
  request: string,
): { [key: string]: Reducer<typeof initialAsyncState> } => ({
  [`${request}__PENDING`]: (state: StateType<typeof initialAsyncState>) => ({
    ...state,
    status: 'PENDING',
    messages: initialAsyncState.messages,
  }),
  [`${request}__CANCELLED`]: (state: StateType<typeof initialAsyncState>) => ({
    ...state,
    status: 'IDLE',
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
    status: 'FULFILLED',
    data: action.payload,
  }),
  [`${request}__FAILED`]: (
    state: StateType<typeof initialAsyncState>,
    action: ActionType<T>,
  ) => ({
    ...state,
    status: 'FAILED',
    messages: action.payload,
  }),
});
