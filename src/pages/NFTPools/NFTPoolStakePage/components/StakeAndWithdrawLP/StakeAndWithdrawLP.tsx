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
  return (
    <LoadingModal
      title="Please approve transaction"
      visible={visible}
      onCancel={close}
    />
  );
};
