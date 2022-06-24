import { FC } from 'react';

import styles from './DailyActive.module.scss';
import Block from '../Block';
import { DailyStats } from '../../../../state/stats/types';

interface DailyStatsProps {
  dailyStats: DailyStats;
}

const DailyActive: FC<DailyStatsProps> = ({ dailyStats }) => {
  const {
    lockedNftsInLoans,
    issuedIn24Hours,
    paidBackIn24Hours,
    liquidatedIn24Hours,
  } = dailyStats;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Daily Active</h2>
      <Block className={styles.content}>
        <Block className={styles.block}>
          <h3 className={styles.subtitle}>Locked NFT in Loans</h3>
          <p className={styles.value}>{lockedNftsInLoans}</p>
        </Block>
        <Block className={styles.block}>
          <h3 className={styles.subtitle}>Issued in 24 hours</h3>
          <p className={styles.value}>{issuedIn24Hours}</p>
        </Block>
        <Block className={styles.block}>
          <h3 className={styles.subtitle}>Paid back in 24 hours</h3>
          <p className={styles.value}>{paidBackIn24Hours}</p>
        </Block>
        <Block className={styles.block}>
          <h3 className={styles.subtitle}>Liquidated in 24 hours</h3>
          <p className={styles.value}>{liquidatedIn24Hours}</p>
        </Block>
      </Block>
    </div>
  );
};

export default DailyActive;
