import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '../../../../components/ConnectWalletSection';
import { LoansList } from '../../../WalletPage/components/LoansList';
import styles from './MyLoansTab.module.scss';

export const MyLoansTab = (): JSX.Element => {
  const { connected } = useWallet();

  return (
    <div className={styles.wrapper}>
      {connected ? (
        <LoansList />
      ) : (
        <ConnectWalletSection text="Connect your wallet to check if you have any active loans" />
      )}
    </div>
  );
};
