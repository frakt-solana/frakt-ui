import moment from 'moment';
import { useRef, useEffect, useState } from 'react';

const SECONDS_IN_DAY = 86_400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;
const HOURS_IN_DAY = 24;

const useRemainLoan = (
  duration: number,
  expiredAt: string,
): {
  days: number;
  hours: string | number;
  minutes: string | number;
  seconds: string | number;
  width: number;
} => {
  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());

  const timeDifference = moment(expiredAt).diff(currentTime);
  const durationSeconds =
    duration * SECONDS_IN_MINUTE * SECONDS_IN_MINUTE * HOURS_IN_DAY;
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null);

  if (timeDifference > 0) {
    const days = Math.trunc(timeDifference / 1000 / SECONDS_IN_DAY);

    const hours = Math.trunc(
      ((timeDifference / 1000) % SECONDS_IN_DAY) / SECONDS_IN_HOUR,
    );

    const minutes = Math.trunc(
      ((timeDifference / 1000) % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
    );

    const seconds = Math.trunc((timeDifference / 1000) % SECONDS_IN_MINUTE);

    const width = (100 * (timeDifference / 1000)) / durationSeconds;

    useEffect(() => {
      intervalIdRef.current = setInterval(() => {
        setCurrentTime(moment());
      }, 1000);

      return () => clearInterval(intervalIdRef.current);
    }, []);

    useEffect(() => {
      moment.duration(timeDifference).asSeconds() < 0 &&
        clearInterval(intervalIdRef.current);
    }, [timeDifference]);

    return {
      days: days,
      hours: hours < 10 ? '0' + hours : hours,
      minutes: minutes < 10 ? '0' + minutes : minutes,
      seconds: seconds < 10 ? '0' + seconds : seconds,
      width: width,
    };
  }
};

export default useRemainLoan;
