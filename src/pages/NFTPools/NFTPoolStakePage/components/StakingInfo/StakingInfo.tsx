import classNames from 'classnames';
import { FC } from 'react';

import { WalletInfoBalance } from '../WalletInfoBalance';
import { WalletInfoButton } from '../WalletInfoButton';
import { WalletInfoWrapper } from '../WalletInfoWrapper';
import styles from './StakingInfo.module.scss';

interface StakingInfoProps {
  className?: string;
}

export const StakingInfo: FC<StakingInfoProps> = ({ className }) => {
  return (
    <WalletInfoWrapper className={classNames(styles.stakingInfo, className)}>
      <div className={styles.stakingRow}>
        <WalletInfoBalance
          className={styles.stakingBalance}
          title="rPWNG STAKING"
          values={['10.000']}
        />
        <WalletInfoButton className={styles.stakingBtn}>
          Unstake
        </WalletInfoButton>
      </div>
      <div className={styles.stakingRow}>
        <WalletInfoBalance
          className={styles.stakingBalance}
          title="rPWNG/SOL Staking"
          values={['10.000']}
        />
        <WalletInfoButton className={styles.stakingBtn}>
          Withdraw
        </WalletInfoButton>
      </div>
    </WalletInfoWrapper>
  );
};
