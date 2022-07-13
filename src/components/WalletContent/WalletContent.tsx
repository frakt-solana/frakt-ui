import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.scss';
import { WalletItem } from './WalletItem';
import { useWallet } from '@solana/wallet-adapter-react';
import CurrentUserTable from '../CurrentUserTable';
import { commonActions } from '../../state/common/actions';
import { selectUser } from '../../state/common/selectors';
import { sendAmplitudeData } from '../../utils/amplitude';

interface WalletContentProps {
  className?: string;
}

const WalletContent = ({ className = '' }: WalletContentProps): JSX.Element => {
  const dispatch = useDispatch();
  const { wallets, select, connected } = useWallet();
  const user = useSelector(selectUser);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div
        className={styles.overlay}
        onClick={() => {
          dispatch(commonActions.setWalletModal({ isVisible: false }));
          sendAmplitudeData('navigation-connect');
        }}
      />
      <div className={`${styles.container} container`}>
        {connected ? (
          <CurrentUserTable className={styles.itemsContainer} user={user} />
        ) : (
          <div className={styles.itemsContainer}>
            {wallets.map(({ name, icon: iconUrl }, idx) => (
              <WalletItem
                key={idx}
                onClick={(): void => {
                  select(name);
                  dispatch(commonActions.setWalletModal({ isVisible: false }));
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
