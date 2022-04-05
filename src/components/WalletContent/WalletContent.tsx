import { useWallet } from '@solana/wallet-adapter-react';

import { useLoans } from '../../contexts/loans';
import { useWalletModal } from '../../contexts/WalletModal';
import CurrentUserTable from '../CurrentUserTable';
import styles from './styles.module.scss';
import { WalletItem } from './WalletItem';

interface WalletContentProps {
  className?: string;
}

const WalletContent = ({ className = '' }: WalletContentProps): JSX.Element => {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const { isPawnshopAuthenticated, pawnshopLogin } = useLoans();

  const { connected, wallets, select } = wallet;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.overlay} onClick={() => setVisible(false)} />
      <div className={`${styles.container} container`}>
        {connected && isPawnshopAuthenticated ? (
          <CurrentUserTable className={styles.itemsContainer} />
        ) : (
          <div className={styles.itemsContainer}>
            {wallets.map(({ name, icon: iconUrl }, idx) => (
              <WalletItem
                key={idx}
                onClick={() => {
                  select(name);
                  setVisible(false);
                  setTimeout(() => {
                    pawnshopLogin();
                  }, 1000);
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
