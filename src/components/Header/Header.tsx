import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { Container } from '../Layout';
import React from 'react';
import { AppNavigation } from './AppNavigation';
import BurgerMenu from '../BurgerMenu';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import NavigationLink from './NavigationLink';
import { useWallet } from '@solana/wallet-adapter-react';
import ConnectButton from '../ConnectButton';
import ConnectedButton from '../ConnectedButton';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps): JSX.Element => {
  const { connected } = useWallet();

  return (
    <header className={classNames([styles.root, className])}>
      <Container component="nav" className={styles.container}>
        <NavLink className={styles.logo} to={PATHS.ROOT}>
          Fraktion
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
    </header>
  );
};

export default Header;
