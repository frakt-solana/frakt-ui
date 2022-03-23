import { FC } from 'react';

import styles from './WalletNotConnected.module.scss';
import { useWalletModal } from '../../../../contexts/WalletModal';
import Button from '../../../../components/Button';

interface WalletNotConnectedProps {
  className?: string;
  type: 'sell' | 'swap';
}

export const WalletNotConnected: FC<WalletNotConnectedProps> = ({
  className,
  type,
}) => {
  const { setVisible } = useWalletModal();

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <p className={styles.text}>
        Connect your wallet to check if you have any suitable NFTs to {type}.
      </p>
      <Button
        type="alternative"
        className={styles.connectButton}
        onClick={() => setVisible(true)}
      >
        Connect wallet
      </Button>
    </div>
  );
};
