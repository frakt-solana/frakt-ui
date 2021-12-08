import React from 'react';
import styles from '../styles.module.scss';
import classNames from 'classnames/bind';
import { URLS } from '../../../constants';
import { WalletInfo } from '../WalletInfo/WalletInfo';
import NavigationLink from '../NavigationLink';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../contexts/WalletModal';
import { NavLink } from 'react-router-dom';

export const MobileMenu = (): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <>
      <div className={styles.logoWrapper}>
        <NavLink
          className={classNames(styles.logo, styles.logoMobile)}
          to={URLS.ROOT}
        >
          Fraktion
        </NavLink>
      </div>
      <div className={styles.mobileMenuWrapper}>
        <ul className={styles.navMobile}>
          <li
            className={classNames(styles.bgAccent, {
              [styles.connectedBtn]: connected,
            })}
          >
            <NavigationLink to={URLS.FRAKTIONALIZE}>
              Fraktionalize
            </NavigationLink>
          </li>
          <li
            className={classNames(styles.mobileHeaderButton, {
              [styles.connectedCardInfo]: connected,
            })}
          >
            {connected ? (
              <WalletInfo />
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
        <ul className={classNames(styles.navMobile, styles.mobileMenu)}>
          <li>
            <NavigationLink to={URLS.VAULTS}>Vaults</NavigationLink>
          </li>
          <li>
            <NavigationLink to={URLS.SWAP}>Swap</NavigationLink>
          </li>
          <li>
            <a
              className={styles.link}
              href={URLS.DEX}
              target="_blank"
              rel="noopener noreferrer"
            >
              Trade
            </a>
          </li>
          {connected && (
            <li>
              <NavigationLink
                to={`${URLS.WALLET}/${publicKey.toString()}`}
                isActive={(_, location) =>
                  location?.pathname?.includes(publicKey.toString()) || false
                }
              >
                My collection
              </NavigationLink>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};
