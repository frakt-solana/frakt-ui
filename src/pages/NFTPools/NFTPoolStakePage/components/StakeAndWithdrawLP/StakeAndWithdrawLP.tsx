import { FC } from 'react';

import { LoadingModal } from '../../../../../components/LoadingModal';

interface StakeAndWithdrawLPProps {
  visible: boolean;
  close: () => void;
}

export const StakeAndWithdrawLP: FC<StakeAndWithdrawLPProps> = ({
  visible,
  close,
}) => {
  return <LoadingModal visible={visible} onCancel={close} />;
};
