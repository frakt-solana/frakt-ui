import { useRef } from 'react';
import { debounce } from 'lodash';

export const useDebounce = (
  cb: (value?: any) => void,
  delay = 2000,
): ((value?: any) => void) =>
  useRef(debounce((value?: any) => cb(value), delay)).current;
