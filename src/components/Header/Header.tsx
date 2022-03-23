import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { Container } from '../Layout';
import {
  AppNavigation,
  DropdownMenuDoStuff,
  DropdownMenuMore,
} from './AppNavigation';
import BurgerMenu from '../BurgerMenu';
import { PATHS } from '../../constants';
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

  const checkIsLogin = (): boolean => {
    const walletTS = localStorage.getItem('wallet');
    if (walletTS) return true;
    return false;
  };

  return (
    <header className={classNames(styles.root, styles.header, className)}>
      {visible && <WalletContent checkIsLogin={checkIsLogin} />}
      <Container component="nav" className={styles.container}>
        <NavLink className={styles.logo} to={PATHS.ROOT}>
          Frakt
        </NavLink>
        <AppNavigation>
          <DropdownMenuMore />
        </AppNavigation>
        <ul className={styles.buttons}>
          <li className={styles.bgAccent}>
            <AppNavigation withoutLinks>
              <DropdownMenuDoStuff />
            </AppNavigation>
          </li>
          <li>
            <div className={styles.profileWrapper}>
              {connected && checkIsLogin() ? (
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
