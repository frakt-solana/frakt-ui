import React, { FC } from 'react';
import styles from '../styles.module.scss';
import classNames from 'classnames/bind';
import { PATHS } from '../../../constants';
import NavigationLink from '../NavigationLink';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Dropdown } from 'antd';
import {
  TwitterIcon,
  GitHubIcon,
  DiscordIcon,
  ArrowDownBtn,
  MediumIcon,
  DocsIcon,
  CoinGeckoIcon,
} from '../../../icons';
import { NavLink } from 'react-router-dom';

interface AppNavigation {
  className?: string;
}

const dropdownMenu = (
  <ul className={styles.dropdownMenu}>
    <li>
      <NavLink to={PATHS.COLLECTIONS}>Collections</NavLink>
    </li>
    <li>
      <a
        href={process.env.REACT_APP_DEX_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Trade
      </a>
    </li>
    <li className={styles.dropdownItem}>
      <a href="" className={styles.dropdownLink}>
        <TwitterIcon width={24} /> Twitter
      </a>
    </li>
    <li className={styles.dropdownItem}>
      <a href="" className={styles.dropdownLink}>
        <DiscordIcon width={24} /> Discord
      </a>
    </li>
    <li className={styles.dropdownItem}>
      <a href="" className={styles.dropdownLink}>
        <GitHubIcon width={24} /> GitHub
      </a>
    </li>
    <li className={styles.dropdownItem}>
      <a href="" className={styles.dropdownLink}>
        <MediumIcon width={24} /> Medium
      </a>
    </li>
    <li className={styles.dropdownItem}>
      <a href="" className={styles.dropdownLink}>
        <DocsIcon width={24} /> Docs
      </a>
    </li>
    <li className={styles.dropdownItem}>
      <a href="" className={styles.dropdownLink}>
        <CoinGeckoIcon width={24} /> CoinGecko
      </a>
    </li>
  </ul>
);

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
        <NavigationLink to={PATHS.YIELD}>Yield</NavigationLink>
      </li>
      <li id={'myDrop'}>
        <Dropdown
          overlay={dropdownMenu}
          placement={'bottomRight'}
          className={styles.dropdown}
          getPopupContainer={() => document.getElementById('myDrop')}
        >
          <Button>
            More <ArrowDownBtn className={styles.moreArrowIcon} />
          </Button>
        </Dropdown>
      </li>
    </ul>
  );
};
