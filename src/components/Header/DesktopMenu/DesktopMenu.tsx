import React from 'react';
import styles from '../styles.module.scss';
import classNames from 'classnames/bind';
import { URLS } from '../../../constants';
import { WalletInfo } from '../WalletInfo/WalletInfo';
import NavigationLink from '../NavigationLink';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../contexts/WalletModal';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'antd';
import { shortenAddress } from '../../../utils/solanaUtils';
import { ChevronDownIcon } from '../../../icons/ChevronDownIcon';

export const DesktopMenu = (): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <>
      <NavLink className={styles.logo} to={URLS.ROOT}>
        Fraktion
      </NavLink>
      <ul className={classNames(styles.navigation, styles.navigation_left)}>
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
          <>
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
            <li>
              <NavigationLink to={URLS.COLLECTIONS}>Collections</NavigationLink>
            </li>
          </>
        )}
      </ul>
      <ul className={styles.navigation}>
        <li className={styles.bgAccent}>
          <NavigationLink to={URLS.FRAKTIONALIZE}>Fraktionalize</NavigationLink>
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
    </>
  );
};
