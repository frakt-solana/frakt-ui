import classNames from 'classnames/bind';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink } from 'react-router-dom';

import styles from './styles.module.scss';
import { Container } from '../Layout';
import { FC } from 'react';
import { AppNavigation } from './AppNavigation';
import BurgerMenu from '../BurgerMenu';
import { PATHS } from '../../constants';
import NavigationLink from './NavigationLink';
import ConnectButton from '../ConnectButton';
import ConnectedButton from '../ConnectedButton';
import WalletContent from '../WalletContent';
import { useWalletModal } from '../../contexts/WalletModal';

interface HeaderProps {
  className?: string;
  CustomHeader?: FC;
}

const Header: FC<HeaderProps> = ({ className, CustomHeader }) => {
  const { connected } = useWallet();
  const { visible } = useWalletModal();

  return (
    <header
      className={classNames(styles.root, styles.header, className, {
        [styles.hasCustomHeader]: CustomHeader,
      })}
    >
      {visible && <WalletContent />}
      <Container component="nav" className={styles.container}>
        <NavLink className={styles.logo} to={PATHS.ROOT}>
          Frakt
        </NavLink>
        <AppNavigation />
        <ul className={styles.buttons}>
          <li className={styles.bgAccent}>
            <NavigationLink to={PATHS.FRAKTIONALIZE}>
              Fraktionalize
            </NavigationLink>
          </li>
          <li>
            <div className={styles.profileWrapper}>
              {connected ? (
                <ConnectedButton
                  className={classNames(
                    styles.walletBtn,
                    styles.walletConnectedBtn,
                  )}
                />
              ) : (
                <ConnectButton className={styles.walletBtn} />
              )}
            </div>
          </li>
        </ul>
        <BurgerMenu />
      </Container>
      {CustomHeader && <CustomHeader />}
    </header>
  );
};

export default Header;
