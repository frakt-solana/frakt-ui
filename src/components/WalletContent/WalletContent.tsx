import React from 'react';
import styles from './styles.module.scss';
import { WalletItem } from './WalletItem';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../contexts/WalletModal';
import CurrentUserTable from '../CurrentUserTable';

interface WalletContentProps {
  className?: string;
}

const WalletContent = ({ className = '' }: WalletContentProps): JSX.Element => {
  const { wallets, select, connected } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.overlay} onClick={() => setVisible(false)} />
      <div className={`${styles.container} container`}>
        {connected ? (
          <CurrentUserTable className={styles.itemsContainer} />
        ) : (
          <div className={styles.itemsContainer}>
            {wallets.map(({ name, icon: iconUrl }, idx) => (
              <WalletItem
                key={idx}
                onClick={(): void => {
                  select(name);
                  setVisible(false);
                }}
                imageSrc={iconUrl}
                imageAlt={name}
                name={name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletContent;
