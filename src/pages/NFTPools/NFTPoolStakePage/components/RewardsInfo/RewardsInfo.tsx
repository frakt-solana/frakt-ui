import { FC } from 'react';

import { WalletInfoBalance } from '../WalletInfoBalance';
import { WalletInfoButton } from '../WalletInfoButton';
import { WalletInfoWrapper } from '../WalletInfoWrapper';
import styles from './RewardsInfo.module.scss';

interface RewardsInfoProps {
  rewards: {
    ticker: string;
    balance: number;
  }[];
  onHarvest?: () => void;
  hideHarvestBtn?: boolean;
  className?: string;
}

export const RewardsInfo: FC<RewardsInfoProps> = ({
  rewards,
  onHarvest = () => {},
  className,
}) => {
  const rewardsValues =
    rewards?.map(({ ticker, balance }) => `${balance?.toFixed(5)} ${ticker}`) ||
    [];

  const harvestAvailable = !!rewards?.find(({ balance }) => !!balance) || false;

  return (
    <WalletInfoWrapper className={className}>
      <WalletInfoBalance title="PENDING REWARDS" values={rewardsValues} />
      {harvestAvailable && (
        <WalletInfoButton className={styles.harvestBtn} onClick={onHarvest}>
          Harvest
        </WalletInfoButton>
      )}
    </WalletInfoWrapper>
  );
};
