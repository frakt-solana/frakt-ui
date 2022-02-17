import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { CountdownIcon } from '../../icons';
import { useAuctionCountdown } from '../../contexts/fraktion';

interface AuctionCountdownProps {
  endTime: number;
  className?: string;
}

export const AuctionCountdown = ({
  endTime,
  className,
}: AuctionCountdownProps): JSX.Element => {
  const { leftTime, leftTimeInSeconds } = useAuctionCountdown(endTime);

  if (leftTimeInSeconds < 0) return null;

  return (
    <ul className={classNames(className, styles.countdown)}>
      <li className={styles.countdownIcon}>
        <CountdownIcon />
      </li>
      <li className={styles.timeItem}>
        {leftTime.days}
        <span>Days</span>
      </li>
      <li className={styles.timeItem}>
        {leftTime.hours}
        <span>Hours</span>
      </li>
      <li className={styles.timeItem}>
        {leftTime.minutes}
        <span>Minutes</span>
      </li>
      <li className={styles.timeItem}>
        {leftTime.seconds}
        <span>Seconds</span>
      </li>
    </ul>
  );
};
