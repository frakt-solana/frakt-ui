import { ReactNode } from 'react';

export enum NotifyType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export interface NotifyOject {
  message: string;
  description?: string | ReactNode;
  type?: NotifyType;
  persist?: boolean;
  key?: string;
}

export type Notify = (value: NotifyOject) => void;
