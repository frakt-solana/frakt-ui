import { useState } from 'react';

type UsePartialRepayModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const usePartialRepayModal: UsePartialRepayModal = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
  };
};
