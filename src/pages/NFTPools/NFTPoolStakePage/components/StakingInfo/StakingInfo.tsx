import classNames from 'classnames';
import { FC } from 'react';
import { CONTROLS } from '../../constants';

import { WalletInfoBalance } from '../WalletInfoBalance';
import { WalletInfoButton } from '../WalletInfoButton';
import { WalletInfoWrapper } from '../WalletInfoWrapper';
import styles from './StakingInfo.module.scss';

interface StakingInfoProps {
  poolToken?: {
    ticker: string;
    balance: number;
  };
  lpToken?: {
    ticker: string;
    balance: number;
  };
  onUnstake: () => void;
  onWithdraw: () => void;
  activeControl?: CONTROLS;
  className?: string;
}

export const StakingInfo: FC<StakingInfoProps> = ({
  poolToken,
  lpToken,
  onWithdraw,
  onUnstake,
  activeControl,
  className,
}) => {
  return (
    <WalletInfoWrapper className={classNames(styles.stakingInfo, className)}>
      {!!poolToken?.balance && (
        <div className={styles.stakingRow}>
          <WalletInfoBalance
            className={styles.stakingBalance}
            title={`${poolToken?.ticker} STAKING`}
            values={[poolToken?.balance ? poolToken.balance.toFixed(3) : '0']}
          />
          <WalletInfoButton
            className={classNames([
              styles.stakingBtn,
              {
                [styles.stakingBtnPressed]:
                  activeControl === CONTROLS.UNSTAKE_INVENTORY_MODAL,
              },
            ])}
            onClick={onUnstake}
          >
            Unstake
          </WalletInfoButton>
        </div>
      )}
      {!!lpToken?.balance && (
        <div className={styles.stakingRow}>
          <WalletInfoBalance
            className={styles.stakingBalance}
            title={`${lpToken?.ticker} STAKING`}
            values={[lpToken?.balance ? lpToken.balance.toFixed(3) : '0']}
          />
          <WalletInfoButton
            className={classNames([
              styles.stakingBtn,
              {
                [styles.stakingBtnPressed]:
                  activeControl === CONTROLS.WITHDRAW_LIQUIDITY_MODAL,
              },
            ])}
            onClick={onWithdraw}
          >
            Withdraw
          </WalletInfoButton>
        </div>
      )}
    </WalletInfoWrapper>
  );
};
