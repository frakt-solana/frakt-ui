import { useState } from 'react';

import { Loan } from '../../../../state/loans/types';

type UsePartialRepayModal = (priceBasedLoan: Loan) => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const usePartialRepayModal: UsePartialRepayModal = (priceBasedLoan) => {
  const [visible, setVisible] = useState<boolean>(false);

  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
  };
};
