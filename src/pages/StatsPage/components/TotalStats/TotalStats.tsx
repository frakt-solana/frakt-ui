import { FC } from 'react';
import Block from '../Block';
import styles from './TotalStats.module.scss';

interface TotalStatsProps {
  lockedNftsInPools: number;
  poolsTvl: number;
  poolsVolumeAllTime: number;
  totalIssuedInLoans: number;
  loansTvl: number;
  loansVolumeAllTime: number;
}

const TotalStats: FC<TotalStatsProps> = ({
  lockedNftsInPools,
  poolsTvl,
  poolsVolumeAllTime,
  totalIssuedInLoans,
  loansTvl,
  loansVolumeAllTime,
}) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Total stats</h2>
      <Block className={styles.block}>
        <div className={styles.statsWrapper}>
          <div className={styles.statsInfo}>
            <h3 className={styles.subtitle}>Locked NFTs in Pools</h3>
            <p className={styles.value}>{lockedNftsInPools}</p>
          </div>
          <div className={styles.statsInfo}>
            <h3 className={styles.subtitle}>Pools TVL</h3>
            <p className={styles.value}>{poolsTvl} SOL</p>
          </div>
          <div className={styles.statsInfo}>
            <h3 className={styles.subtitle}>Pools Volume all time</h3>
            <p className={styles.value}>{poolsVolumeAllTime} SOL</p>
          </div>
          <div className={styles.statsInfo}>
            <h3 className={styles.subtitle}>Issued Loans all time</h3>
            <p className={styles.value}>{totalIssuedInLoans}</p>
          </div>
          <div className={styles.statsInfo}>
            <h3 className={styles.subtitle}>Loans TVL</h3>
            <p className={styles.value}>{loansTvl} SOL</p>
          </div>
          <div className={styles.statsInfo}>
            <h3 className={styles.subtitle}>Loans volume all time</h3>
            <p className={styles.value}>{loansVolumeAllTime} SOL</p>
          </div>
        </div>
        <div className={styles.totalWrapper}>
          <div className={styles.totalContent}>
            <h3 className={styles.subtitle}>Total value locked</h3>
            <p className={styles.value}>1957.4905 SOL</p>
          </div>
          <div className={styles.totalContent}>
            <h3 className={styles.subtitle}>Total value locked</h3>
            <p className={styles.value}>1957.4905 SOL</p>
          </div>
        </div>
      </Block>
    </div>
  );
};

export default TotalStats;
