import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { commonActions } from '../../../../state/common/actions';
import styles from './ConnectWalletSection.module.scss';
import Button from '../../../../components/Button';

const ConnectWalletSection: FC = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.connectWallet}>
      <p className={styles.connectWalletText}>
        Connect your wallet to check if you have any active loans
      </p>
      <Button
        type="alternative"
        className={styles.connectWalletBtn}
        onClick={() =>
          dispatch(commonActions.setWalletModal({ isVisible: true }))
        }
      >
        Connect wallet
      </Button>
    </div>
  );
};

export default ConnectWalletSection;
