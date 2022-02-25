import { FC } from 'react';

import styles from './WalletNotConnected.module.scss';
import { useWalletModal } from '../../../../contexts/WalletModal';

interface WalletNotConnectedProps {
  className?: string;
}

export const WalletNotConnected: FC<WalletNotConnectedProps> = ({
  className,
}) => {
  const { setVisible } = useWalletModal();

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <p className={styles.text}>
        Connect your wallet to check if you have any eligible NFTs to swap.
      </p>
      <button className={styles.connectButton} onClick={() => setVisible(true)}>
        Connect wallet
      </button>
    </div>
  );
};
