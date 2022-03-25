import { useWallet } from '@solana/wallet-adapter-react';

import { useWalletModal } from '../../contexts/WalletModal';
import CurrentUserTable from '../CurrentUserTable';
import styles from './styles.module.scss';
import { WalletItem } from './WalletItem';
import { login } from '../../utils/loans';

interface WalletContentProps {
  className?: string;
  authenticated: any;
}

const WalletContent = ({
  className = '',
  authenticated,
}: WalletContentProps): JSX.Element => {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const { connected, wallets, select } = wallet;

  const signToken = () => {
    const walletLS = localStorage.getItem('wallet');
    const walletName = localStorage.getItem('walletName');

    if (!walletLS && walletName) {
      login(wallet);
    }
    return;
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.overlay} onClick={() => setVisible(false)} />
      <div className={`${styles.container} container`}>
        {connected && authenticated ? (
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
                    signToken();
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
