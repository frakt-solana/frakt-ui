import { useEffect, useRef } from 'react';

const usePrevious = (value): unknown => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useOnFulfilled = (status: string, handler: () => void): void => {
  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus === 'PENDING' && status === 'FULFILLED') {
      handler();
    }
  }, [status]);
};

export const useOnFailed = (status: string, handler: () => void): void => {
  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus === 'PENDING' && status === 'FAILED') {
      handler();
    }
  }, [status]);
};
