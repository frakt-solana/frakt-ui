import { useState } from 'react';

type UseLoadingModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useLoadingModal: UseLoadingModal = () => {
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
