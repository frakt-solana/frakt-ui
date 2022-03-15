import { useState } from 'react';

type UseConfirmModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useConfirmModal: UseConfirmModal = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return {
    visible,
    open,
    close,
  };
};
