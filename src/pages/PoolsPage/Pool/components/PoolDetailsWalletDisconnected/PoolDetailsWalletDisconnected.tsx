import { FC } from 'react';

import Button from '../../../../../components/Button';
import styles from './PoolDetailsWalletDisconnected.module.scss';

interface PoolDetailsWalletDisconnectedProps {
  setWalletModalVisible: (walletModalVisible: boolean) => void;
  className?: string;
}

export const PoolDetailsWalletDisconnected: FC<PoolDetailsWalletDisconnectedProps> =
  ({ setWalletModalVisible, className }) => {
    return (
      <div className={className}>
        <Button
          onClick={() => setWalletModalVisible(true)}
          className={styles.connectBtn}
        >
          Connect wallet
        </Button>
      </div>
    );
  };
