import { FC } from 'react';

import styles from './TicketsRefillCountdown.module.scss';
import { Timer } from '../../../../icons';

export const TicketsRefillCountdown: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Timer className={styles.icon} />
      <div>
        <h2 className={styles.value}>Next refill in 14m : 11s</h2>
        <div className={styles.timeProgressWrapper}>
          <div className={styles.timeProgress} style={{ width: `${20}%` }} />
        </div>
      </div>
    </div>
  );
};
