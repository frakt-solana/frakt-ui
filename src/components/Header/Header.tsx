import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { Container } from '../Layout';
import React, { useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { AppNavigation } from './AppNavigation';
import BurgerMenu from '../BurgerMenu';
import { NavLink } from 'react-router-dom';
import { URLS } from '../../constants';
import NavigationLink from './NavigationLink';
import { Tooltip } from 'antd';
import { WalletInfo } from './WalletInfo/WalletInfo';
import { shortenAddress } from '../../utils/solanaUtils';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../contexts/WalletModal';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <header className={classNames([styles.root, className])}>
      <Container component="nav" className={styles.container}>
        <NavLink className={styles.logo} to={URLS.ROOT}>
          Fraktion
        </NavLink>
        <AppNavigation />
        <ul className={styles.buttons}>
          <li className={styles.bgAccent}>
            <NavigationLink to={URLS.FRAKTIONALIZE}>Fraktion</NavigationLink>
          </li>
          <li>
            {connected ? (
              <Tooltip
                overlayClassName={styles.walletInfo}
                trigger="click"
                placement="topRight"
                title={WalletInfo}
              >
                <button
                  className={classNames([
                    styles.walletBtn,
                    styles.walletBtn_connected,
                  ])}
                >
                  {shortenAddress(publicKey.toString())}
                  <ChevronDownIcon className={styles.walletBtn__icon} />
                </button>
              </Tooltip>
            ) : (
              <button
                className={styles.walletBtn}
                onClick={() => setVisible(true)}
              >
                Connect wallet
              </button>
            )}
          </li>
        </ul>
        <BurgerMenu />
      </Container>
    </header>
  );
};

export default Header;
