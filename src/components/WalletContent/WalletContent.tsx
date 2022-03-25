import { useWallet } from '@solana/wallet-adapter-react';

import { useWalletModal } from '../../contexts/WalletModal';
import CurrentUserTable from '../CurrentUserTable';
import styles from './styles.module.scss';
import { WalletItem } from './WalletItem';
import { login } from '../../utils/loans';

interface WalletContentProps {
  className?: string;
  checkIsLogin: any;
}

const WalletContent = ({
  className = '',
  checkIsLogin,
}: WalletContentProps): JSX.Element => {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const { connected, wallets, select } = wallet;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.overlay} onClick={() => setVisible(false)} />
      <div className={`${styles.container} container`}>
        {connected && checkIsLogin() ? (
          <CurrentUserTable className={styles.itemsContainer} />
        ) : (
          <div className={styles.itemsContainer}>
            {wallets.map(({ name, icon: iconUrl }, idx) => (
              <WalletItem
                key={idx}
                onClick={async () => {
                  select(name);
                  setVisible(false);
                  await login(wallet);
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
