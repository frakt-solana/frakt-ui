import classNames from 'classnames';

import styles from './styles.module.scss';
import { CountdownIcon } from '../../icons';
import { useCountdown } from '../../hooks';

interface AuctionCountdownProps {
  endTime: number;
  className?: string;
}

export const AuctionCountdown = ({
  endTime,
  className,
}: AuctionCountdownProps): JSX.Element => {
  const { timeLeft, leftTimeInSeconds } = useCountdown(endTime);

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
