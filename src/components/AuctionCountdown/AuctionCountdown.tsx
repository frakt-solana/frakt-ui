import React from 'react';
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
  const { timeLeft, leftTimeInSeconds } = useAuctionCountdown(endTime);

  if (leftTimeInSeconds < 0) return null;

  return (
    <ul className={classNames(className, styles.countdown)}>
      <li className={styles.countdownIcon}>
        <CountdownIcon />
      </li>
      <li className={styles.timeItem}>
        {timeLeft.days}
        <span>Days</span>
      </li>
      <li className={styles.timeItem}>
        {timeLeft.hours}
        <span>Hours</span>
      </li>
      <li className={styles.timeItem}>
        {timeLeft.minutes}
        <span>Minutes</span>
      </li>
      <li className={styles.timeItem}>
        {timeLeft.seconds}
        <span>Seconds</span>
      </li>
    </ul>
  );
};
