export const initialAsyncState = {
  data: null,
  status: 'IDLE',
  messages: [],
};

export const createHandlers = (request: string, types): any => ({
  [types[`${request}__PENDING`]]: (state) => ({
    ...state,
    status: 'PENDING',
    messages: initialAsyncState.messages,
  }),
  [types[`${request}__CANCELLED`]]: (state) => ({
    ...state,
    status: 'IDLE',
  }),
  [types[`${request}__RESET`]]: (state) => ({
    ...state,
    data: initialAsyncState.data,
  }),
  [types[`${request}__FULFILLED`]]: (state, action) => ({
    ...state,
    status: 'FULFILLED',
    data: action.payload,
  }),
  [types[`${request}__FAILED`]]: (state, action) => ({
    ...state,
    status: 'FAILED',
    messages: action.payload,
  }),
});
