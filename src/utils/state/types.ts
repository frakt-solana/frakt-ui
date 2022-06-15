export interface ServerError {
  code: number;
  message: string;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  IDLE = 'IDLE',
  FULFILLED = 'FULFILLED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  RESET = 'RESET',
}

export interface AsyncState<TData> {
  data: TData | null;
  status: RequestStatus;
  messages: string[];
}
