import React, { FC } from 'react';
import styles from '../styles.module.scss';
import classNames from 'classnames/bind';
import { PATHS } from '../../../constants';
import NavigationLink from '../NavigationLink';
import { useWallet } from '@solana/wallet-adapter-react';

interface AppNavigation {
  className?: string;
}

export const AppNavigation: FC<AppNavigation> = ({ className }) => {
  const { connected, publicKey } = useWallet();

  return (
    <ul
      className={classNames(
        styles.navigation,
        styles.navigation_left,
        className,
      )}
    >
      <li>
        <NavigationLink to={PATHS.TEST}>Test</NavigationLink>
      </li>
      <li>
        <NavigationLink to={PATHS.MARKET}>Market</NavigationLink>
      </li>
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
  );
};
