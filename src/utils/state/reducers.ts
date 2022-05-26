import { handleActions } from 'redux-actions';

const initialState = {
  data: null,
  status: 'IDLE',
  messages: [],
};

export const createReducer = (
  types: any,
  request: string,
  customFulfilled?: () => any,
): [{ data: any; status: string; messages: any[] }, any] => {
  const handleFulfilled =
    typeof customFulfilled === 'function'
      ? customFulfilled
      : (state, action) => ({
          ...state,
          status: 'FULFILLED',
          data: action.payload,
        });

  const customReducer = handleActions(
    {
      [types[`${request}--PENDING`]]: (state) => ({
        ...state,
        status: 'PENDING',
        messages: initialState.messages,
      }),
      [types[`${request}--CANCELLED`]]: (state) => ({
        ...state,
        status: 'IDLE',
      }),
      [types[`${request}--RESET`]]: (state) => ({
        ...state,
        data: initialState.data,
      }),
      [types[`${request}--FULFILLED`]]: handleFulfilled,
      [types[`${request}--FAILED`]]: (state, action) => ({
        ...state,
        status: 'FAILED',
        messages: action.payload,
      }),
    },
    initialState,
  );

  return [initialState, customReducer];
};

export const composeReducers = (...funcs) => {
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
