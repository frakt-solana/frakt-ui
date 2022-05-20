import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

type UseCountdown = (endTime: number) => {
  timeLeft: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  leftTimeInSeconds: number;
};

export const useCountdown: UseCountdown = (endTime: number) => {
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
    timeLeft: {
      days: formatDateUnit(timeDifference.days()),
      hours: formatDateUnit(timeDifference.hours()),
      minutes: formatDateUnit(timeDifference.minutes()),
      seconds: formatDateUnit(timeDifference.seconds()),
    },
    leftTimeInSeconds: timeDifference.asSeconds(),
  };
};
