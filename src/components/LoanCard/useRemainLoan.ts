import moment from 'moment';
import { useRef, useEffect, useState } from 'react';

const SECONDS_IN_DAY = 86_400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;
const HOURS_IN_DAY = 24;

const useRemainLoan = (duration: number, expiredAt: string) => {
  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());

  const remainingSourceSeconds = moment(expiredAt).diff(currentTime);
  const durationSeconds =
    duration * SECONDS_IN_MINUTE * SECONDS_IN_MINUTE * HOURS_IN_DAY;
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null);

  if (remainingSourceSeconds > 0) {
    const days = Math.trunc(remainingSourceSeconds / 1000 / SECONDS_IN_DAY);

    const hours = Math.trunc(
      ((remainingSourceSeconds / 1000) % SECONDS_IN_DAY) / SECONDS_IN_HOUR,
    );

    const minutes = Math.trunc(
      ((remainingSourceSeconds / 1000) % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
    );

    const seconds = Math.trunc(
      (remainingSourceSeconds / 1000) % SECONDS_IN_MINUTE,
    );

    const width = (100 * (remainingSourceSeconds / 1000)) / durationSeconds;

    useEffect(() => {
      intervalIdRef.current = setInterval(() => {
        setCurrentTime(moment());
      }, 1000);

      return () => clearInterval(intervalIdRef.current);
    }, []);

    useEffect(() => {
      moment.duration(remainingSourceSeconds).asSeconds() < 0 &&
        clearInterval(intervalIdRef.current);
    }, [remainingSourceSeconds]);

    return {
      days: days,
      hours: hours < 10 ? hours + '0' : hours,
      minutes: minutes < 10 ? minutes + '0' : minutes,
      seconds: seconds < 10 ? seconds + '0' : seconds,
      width: width,
    };
  }
};

export default useRemainLoan;
