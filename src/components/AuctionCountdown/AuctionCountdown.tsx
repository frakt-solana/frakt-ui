import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';

interface AuctionCountdownProps {
  endTimeMoment: number;
  className?: string;
}

export const AuctionCountdown = ({
  endTimeMoment,
  className,
}: AuctionCountdownProps): JSX.Element => {
  const unixToCalendarTime = moment.unix(endTimeMoment);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null);

  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());
  const timeDifference = moment.duration(unixToCalendarTime.diff(currentTime));

  const formatDateUnit = (value) => {
    return value < 10 ? '0' + value : value;
  };

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, []);

  useEffect(() => {
    timeDifference.asSeconds() < 0 && clearInterval(intervalIdRef.current);
  }, [timeDifference]);

  return (
    <ul className={classNames(className, styles.countdown)}>
      <li className={styles.timeItem}>
        {formatDateUnit(timeDifference.hours() + timeDifference.days() * 24)}
        <span>Hours</span>
      </li>
      <li className={styles.timeItem}>
        {formatDateUnit(timeDifference.minutes())}
        <span>Minutes</span>
      </li>
      <li className={styles.timeItem}>
        {formatDateUnit(timeDifference.seconds())}
        <span>Seconds</span>
      </li>
    </ul>
  );
};
