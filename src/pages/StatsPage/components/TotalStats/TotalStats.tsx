import { FC } from 'react';
import classNames from 'classnames';

import { SolanaIcon } from '../../../../icons';
import styles from './TotalStats.module.scss';
import Block from '../Block';
import { TotalStats as TotalStatsInterface } from '../../model';
interface TotalStatsProps {
  totalStats: TotalStatsInterface;
}

const TotalStats: FC<TotalStatsProps> = ({ totalStats }) => {
  const { totalIssuedInLoans, loansTvl, loansVolumeAllTime } = totalStats;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Total stats</h2>
      <Block className={styles.block}>
        <div className={styles.statsWrapper}>
          {/* <div className={classNames(styles.statsInfo, styles.cell_1)}>
            <h3 className={styles.subtitle}>Locked NFTs in Pools</h3>
            <p className={styles.value}>{lockedNftsInPools}</p>
          </div>
          <div className={classNames(styles.statsInfo, styles.cell_2)}>
            <h3 className={styles.subtitle}>Pools TVL</h3>
            <div className={styles.valueInfo}>
              <p className={styles.value}>{poolsTvl}</p>
              <SolanaIcon className={styles.icon} />
              SOL
            </div>
          </div>
          <div className={classNames(styles.statsInfo, styles.cell_3)}>
            <h3 className={styles.subtitle}>Pools Volume all time</h3>
            <div className={styles.valueInfo}>
              <p className={styles.value}>{poolsVolumeAllTime}</p>
              <SolanaIcon className={styles.icon} />
              SOL
            </div>
          </div> */}
          <div className={classNames(styles.statsInfo, styles.cell_4)}>
            <h3 className={styles.subtitle}>Issued Loans all time</h3>
            <p className={styles.value}>{totalIssuedInLoans}</p>
          </div>
          <div className={classNames(styles.statsInfo, styles.cell_5)}>
            <h3 className={styles.subtitle}>Loans volume all time</h3>
            <div className={styles.valueInfo}>
              <p className={styles.value}>{loansVolumeAllTime}</p>
              <SolanaIcon className={styles.icon} />
              SOL
            </div>
          </div>
          <div className={classNames(styles.statsInfo, styles.cell_6)}>
            <h3 className={styles.subtitle}>Loans TVL</h3>
            <div className={styles.valueInfo}>
              <p className={styles.value}>{loansTvl}</p>
              <SolanaIcon className={styles.icon} />
              SOL
            </div>
          </div>
        </div>
        {/* <div className={styles.totalWrapper}>
          <div className={styles.totalContent}>
            <h3 className={classNames(styles.subtitle, styles.subtitleWhite)}>
              Total value locked
            </h3>
            <div className={styles.valueInfo}>
              <p className={styles.value}>1957.4905 SOL</p>
              <SolanaIcon className={styles.icon} />
              <p className={styles.value}>SOL</p>
            </div>
          </div>
          <div className={styles.totalContent}>
            <h3 className={classNames(styles.subtitle, styles.subtitleWhite)}>
              Volume
            </h3>
            <div className={styles.valueInfo}>
              <p className={styles.value}>1957.4905 SOL</p>
              <SolanaIcon className={styles.icon} />
              <p className={styles.value}>SOL</p>
            </div>
          </div>
        </div> */}
      </Block>
    </div>
  );
};

export default TotalStats;
