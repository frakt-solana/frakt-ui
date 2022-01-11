import { useRef, useState } from 'react';

export const usePolling = (
  callback: () => Promise<void>,
  delay = 10000,
  retryCount = 0,
): {
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
} => {
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const persistedIsPolling = useRef<boolean>();
  const poll = useRef<any>();
  const retryCountRef = useRef<number>(retryCount);

  persistedIsPolling.current = isPolling;

  const shouldRetry = !!retryCount;

  const stopPolling = () => {
    if (poll.current) {
      clearTimeout(poll.current);
      poll.current = null;
    }
    setIsPolling(false);
  };

  const startPolling = () => {
    setIsPolling(true);
    runPolling();
  };

  const runPolling = () => {
    poll.current = setTimeout(() => {
      callback()
        .then(() => {
          persistedIsPolling.current ? runPolling() : stopPolling();
        })
        .catch(() => {
          if (shouldRetry && retryCount > 0) {
            retryCountRef.current--;
            runPolling();
          } else {
            stopPolling();
          }
        });
    }, delay);
  };

  return { isPolling, startPolling, stopPolling };
};
