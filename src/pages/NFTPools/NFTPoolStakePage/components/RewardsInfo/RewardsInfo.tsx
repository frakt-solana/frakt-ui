import { FC } from 'react';

import { WalletInfoBalance } from '../WalletInfoBalance';
import { WalletInfoButton } from '../WalletInfoButton';
import { WalletInfoWrapper } from '../WalletInfoWrapper';
import styles from './RewardsInfo.module.scss';

interface RewardsInfoProps {
  values: string[];
  onHarvest?: () => void;
  hideHarvestBtn?: boolean;
  className?: string;
}

export const RewardsInfo: FC<RewardsInfoProps> = ({
  values,
  onHarvest = () => {},
  hideHarvestBtn = false,
  className,
}) => {
  return (
    <WalletInfoWrapper className={className}>
      <WalletInfoBalance title="PENDING REWARDS" values={values} />
      {!hideHarvestBtn && (
        <WalletInfoButton className={styles.harvestBtn} onClick={onHarvest}>
          Harvest
        </WalletInfoButton>
      )}
    </WalletInfoWrapper>
  );
};
