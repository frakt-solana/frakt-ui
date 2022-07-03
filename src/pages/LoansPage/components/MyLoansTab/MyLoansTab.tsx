import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import Button from '../../../../components/Button';
import { commonActions } from '../../../../state/common/actions';
import { LoansList } from '../../../WalletPage/components/LoansList';
import styles from './MyLoansTab.module.scss';

export const MyLoansTab = (): JSX.Element => {
  const { connected } = useWallet();

  return (
    <div className={styles.wrapper}>
      {connected ? <LoansList /> : <ConnectWalletSection />}
    </div>
  );
};

const ConnectWalletSection = () => {
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
