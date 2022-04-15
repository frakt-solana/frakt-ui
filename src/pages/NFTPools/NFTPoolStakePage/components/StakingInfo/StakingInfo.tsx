import classNames from 'classnames';
import { FC } from 'react';

import styles from './StakingInfo.module.scss';

interface StakingInfoProps {
  title: string;
  apr: string;
  totalLiquidity: string;
  infoText: string;
  isRisky?: boolean;
  className?: string;
}

export const StakingInfo: FC<StakingInfoProps> = ({
  title,
  apr,
  totalLiquidity,
  infoText,
  isRisky = false,
  className,
}) => {
  return (
    <div className={classNames(styles.staking, className)}>
      <h2 className={styles.stakingTitle}>{title}</h2>

      <div className={styles.stakingStats}>
        <div className={styles.stakingStatsTitle}>Total liquidity</div>
        <div className={styles.stakingStatsTitle}>APR</div>
        <div className={styles.stakingStatsValue}>{totalLiquidity}</div>
        <div
          className={classNames([
            styles.stakingStatsValue,
            styles.stakingStatsValueGreen,
            { [styles.stakingStatsValueRed]: isRisky },
          ])}
        >
          {apr}
        </div>
      </div>

      <p className={styles.stakingInfo}>{infoText}</p>
    </div>
  );
};
