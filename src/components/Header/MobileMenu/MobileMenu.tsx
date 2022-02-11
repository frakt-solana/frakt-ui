import { NavLink } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import styles from '../styles.module.scss';
import classNames from 'classnames/bind';
import { PATHS } from '../../../constants';
import { WalletInfo } from '../WalletInfo/WalletInfo';
import NavigationLink from '../NavigationLink';
import { useWalletModal } from '../../../contexts/WalletModal';

export const MobileMenu = (): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <>
      <div className={styles.logoWrapper}>
        <NavLink
          className={classNames(styles.logo, styles.logoMobile)}
          to={PATHS.ROOT}
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
            <NavigationLink to={PATHS.FRAKTIONALIZE}>
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
            <NavigationLink to={PATHS.VAULTS}>Vaults</NavigationLink>
          </li>
          <li>
            <NavigationLink to={PATHS.SWAP}>Swap</NavigationLink>
          </li>
          <li>
            <a
              className={styles.link}
              href={process.env.REACT_APP_DEX_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Trade
            </a>
          </li>
          <li>
            <NavigationLink to={PATHS.COLLECTIONS}>Collections</NavigationLink>
          </li>
          <li>
            <NavigationLink to={PATHS.YIELD}>Yield</NavigationLink>
          </li>
          {connected && (
            <li>
              <NavigationLink
                to={`${PATHS.WALLET}/${publicKey.toString()}`}
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
