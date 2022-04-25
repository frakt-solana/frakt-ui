import { FC } from 'react';

import { LoadingModal } from '../../../../../components/LoadingModal';

interface HarvestRewardsProps {
  visible: boolean;
  close: () => void;
}

export const HarvestRewards: FC<HarvestRewardsProps> = ({ visible, close }) => {
  return <LoadingModal visible={visible} onCancel={close} />;
};
