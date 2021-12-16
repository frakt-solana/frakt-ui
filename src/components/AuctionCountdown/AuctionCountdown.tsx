import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';

interface AuctionCountdownProps {
  endAuctionTime: number;
  className?: string;
}

export const AuctionCountdown = ({
  endAuctionTime,
  className,
}: AuctionCountdownProps): JSX.Element => {
  const unixToCalendarTime = moment.unix(endAuctionTime);

  const intervalIdRef = useRef(0);

  const [currentTime, setCurrentTime] = useState(moment());
  const timeBetween = moment.duration(unixToCalendarTime.diff(currentTime));

  useEffect(() => {
    intervalIdRef.current = window.setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, []);

  useEffect(() => {
    timeBetween.asSeconds() < 0 && clearInterval(intervalIdRef.current);
  }, [timeBetween]);

  return (
    <p className={classNames(className, styles.countdown)}>
      {timeBetween.hours() < 10
        ? '0' + timeBetween.hours()
        : timeBetween.hours()}
      .
      {timeBetween.minutes() < 10
        ? '0' + timeBetween.minutes()
        : timeBetween.minutes()}
      .
      {timeBetween.seconds() < 10
        ? '0' + timeBetween.seconds()
        : timeBetween.seconds()}
    </p>
  );
};
