import { FC } from 'react';

import { SolanaIcon } from '../../../../icons';
import styles from './MarketHeaderInner.module.scss';

export const HeaderSellInfo: FC = () => {
  return (
    <div className={styles.sellInfoWrapper}>
      <p className={styles.sellInfoItem}>
        {0.002124} <SolanaIcon /> SOL
      </p>
      <div className={styles.separator} />
      <p className={styles.sellInfoItem}>
        {0.002124}
        <span
          className={styles.infoImage}
          style={{ backgroundImage: `url(${'/'})` }}
        />
        {'TOKEN'}
      </p>
    </div>
  );
};
