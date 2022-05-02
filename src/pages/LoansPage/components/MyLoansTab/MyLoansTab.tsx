import { useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
import Button from '../../../../components/Button';

import { LoanWithArweaveMetadata } from '../../../../contexts/loans';
import { useWalletModal } from '../../../../contexts/WalletModal';
import { LoansList } from '../../../WalletPage/components/LoansList';
import styles from './MyLoansTab.module.scss';

interface MyLoansTabProps {
  userLoans: LoanWithArweaveMetadata[];
  loading: boolean;
}

export const MyLoansTab: FC<MyLoansTabProps> = ({ userLoans, loading }) => {
  const { connected } = useWallet();

  return (
    <div className={styles.wrapper}>
      {connected ? (
        <LoansList loansWithArweaveMetadata={userLoans} loading={loading} />
      ) : (
        <ConnectWalletSection />
      )}
    </div>
  );
};

const ConnectWalletSection = () => {
  const { setVisible } = useWalletModal();

  return (
    <div className={styles.connectWallet}>
      <p className={styles.connectWalletText}>
        Connect your wallet to check if you have any active loans
      </p>
      <Button
        type="alternative"
        className={styles.connectWalletBtn}
        onClick={() => setVisible(true)}
      >
        Connect wallet
      </Button>
    </div>
  );
};
