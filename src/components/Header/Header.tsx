import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { Container } from '../Layout';
import React, { FC } from 'react';
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
  CustomHeader?: FC;
}

const Header: FC<HeaderProps> = ({ className, CustomHeader }) => {
  const { connected } = useWallet();

  return (
    <header
      className={classNames(styles.root, styles.header, className, {
        [styles.hasCustomHeader]: CustomHeader,
      })}
    >
      <Container component="nav" className={styles.container}>
        <NavLink className={styles.logo} to={PATHS.ROOT}>
          Fraktion
        </NavLink>
        <AppNavigation />
        <ul className={styles.buttons}>
          <li className={styles.bgAccent}>
            <NavigationLink to={PATHS.FRAKTIONALIZE}>Fraktion</NavigationLink>
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
