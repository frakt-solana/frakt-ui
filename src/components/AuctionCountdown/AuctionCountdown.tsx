import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { CountdownIcon } from '../../icons';

interface AuctionCountdownProps {
  endTime: number;
  className?: string;
}

export const AuctionCountdown = ({
  endTime,
  className,
}: AuctionCountdownProps): JSX.Element => {
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null);
  const [currentTime, setCurrentTime] = useState<moment.Moment>(moment());

  const endTimeMoment = moment.unix(endTime);
  const timeDifference = moment.duration(endTimeMoment.diff(currentTime));
  const formatDateUnit = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
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

  if (timeDifference.asSeconds() < 0) return null;

  return (
    <ul className={classNames(className, styles.countdown)}>
      <li className={styles.countdownIcon}>
        <CountdownIcon />
      </li>
      <li className={styles.timeItem}>
        {formatDateUnit(timeDifference.days())}
        <span>Days</span>
      </li>
      <li className={styles.timeItem}>
        {formatDateUnit(timeDifference.hours())}
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
