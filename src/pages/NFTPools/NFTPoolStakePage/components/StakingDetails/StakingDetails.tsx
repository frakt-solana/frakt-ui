import classNames from 'classnames';
import { FC } from 'react';

import styles from './StakingDetails.module.scss';

interface StakingDetailsProps {
  title: string;
  apr: string;
  totalLiquidity: string;
  infoText: string;
  isRisky?: boolean;
  className?: string;
}

export const StakingDetails: FC<StakingDetailsProps> = ({
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
        <div
          className={classNames(
            styles.stakingStatsTitle,
            styles.stakingStatsTitleLiquididty,
          )}
        >
          Total liquidity
        </div>
        <div
          className={classNames(
            styles.stakingStatsTitle,
            styles.stakingStatsTitleAPR,
          )}
        >
          APR
        </div>
        <div
          className={classNames(
            styles.stakingStatsValue,
            styles.stakingStatsValueLiquididty,
          )}
        >
          {totalLiquidity}
        </div>
        <div
          className={classNames([
            styles.stakingStatsValue,
            styles.stakingStatsValueAPR,
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
