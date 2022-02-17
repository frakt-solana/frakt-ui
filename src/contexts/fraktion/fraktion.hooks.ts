import { useContext, useEffect, useRef, useState } from 'react';

import { FraktionContext } from './fraktion.context';
import { FraktionContextType } from './fraktion.model';
import moment from 'moment';

export const useFraktion = (): FraktionContextType => {
  const context = useContext(FraktionContext);
  return context;
};

export const useAuctionCountdown = (endTime) => {
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null);
  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());

  const formatDateUnit = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  const endTimeMoment = moment.unix(endTime);
  const timeDifference = moment.duration(endTimeMoment.diff(currentTime));

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, []);

  useEffect(() => {
    timeDifference.asSeconds() < 0 && clearInterval(intervalIdRef.current);
  }, [timeDifference]);

  return {
    leftTime: {
      days: formatDateUnit(timeDifference.days()),
      hours: formatDateUnit(timeDifference.hours()),
      minutes: formatDateUnit(timeDifference.minutes()),
      seconds: formatDateUnit(timeDifference.seconds()),
    },
    leftTimeInSeconds: timeDifference.asSeconds(),
  };
};

export const useFraktionInitialFetch = (): void => {
  const { loading, vaults, refetch } = useFraktion();

  useEffect(() => {
    if (!loading && !vaults.length) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useFraktionPolling = (): void => {
  const { isPolling, startPolling, stopPolling } = useFraktion();

  useEffect(() => {
    !isPolling && startPolling();

    return () => {
      isPolling && stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling]);
};
