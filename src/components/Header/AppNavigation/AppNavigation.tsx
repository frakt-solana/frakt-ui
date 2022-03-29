import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'antd';
import classNames from 'classnames/bind';

import styles from './AppNavigation.module.scss';
import { PATHS } from '../../../constants';
import NavigationLink from '../NavigationLink';
import {
  ArrowDownBtn,
  // CoinGeckoIcon,
  DiscordIcon,
  DocsIcon,
  GitHubIcon,
  MediumIcon,
  TwitterIcon,
} from '../../../icons';

interface AppNavigationProps {
  className?: string;
}

const DROPDOWN_EXTERNAL_LINKS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/FraktArt',
    icon: TwitterIcon,
  },
  {
    label: 'Discord',
    href: 'https://tinyurl.com/zp3rx6z3',
    icon: DiscordIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/frakt-solana',
    icon: GitHubIcon,
  },
  {
    label: 'Medium',
    href: 'https://medium.com/@frakt_HQ',
    icon: MediumIcon,
  },
  {
    label: 'Docs',
    href: 'https://docs.frakt.xyz/',
    icon: DocsIcon,
  },
  // {
  //   label: 'CoinGecko',
  //   href: '',
  //   icon: CoinGeckoIcon,
  // },
];

const dropdownMenu = (
  <ul>
    <li>
      <NavLink className={styles.dropdownLink} to={PATHS.COLLECTIONS}>
        Collections
      </NavLink>
    </li>
    <li>
      <a
        className={styles.dropdownLink}
        href={process.env.DEX_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Trade
      </a>
    </li>
    {DROPDOWN_EXTERNAL_LINKS.map(({ label, href, icon: Icon }, idx) => (
      <li key={idx}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.dropdownLink}
        >
          <Icon width={24} />
          {label}
        </a>
      </li>
    ))}
  </ul>
);

const NAVIGATION_LINKS = [
  // {
  //   to: PATHS.TEST,
  //   label: 'Test',
  // },
  // {
  //   to: PATHS.POOLS,
  //   label: 'Pools',
  // },
  {
    to: PATHS.VAULTS,
    label: 'Vaults',
  },
  {
    to: PATHS.SWAP,
    label: 'Swap',
  },
  {
    to: PATHS.YIELD,
    label: 'Yield',
  },
];

export const AppNavigation: FC<AppNavigationProps> = ({ className }) => {
  return (
    <ul
      className={classNames(
        styles.navigation,
        styles.navigation_left,
        className,
      )}
    >
      {NAVIGATION_LINKS.map(({ label, to }, idx) => (
        <li key={idx} className={styles.navigationItem}>
          <NavigationLink to={to}>{label}</NavigationLink>
        </li>
      ))}
      <li id="menu-dropdown" className={styles.navigationItem}>
        <div className={styles.mobileDropdown}>{dropdownMenu}</div>
        <Dropdown
          overlay={dropdownMenu}
          placement="bottomRight"
          getPopupContainer={() => document.getElementById('menu-dropdown')}
          overlayClassName={styles.dropdown}
        >
          <div className={styles.dropdownTrigger}>
            More <ArrowDownBtn className={styles.moreArrowIcon} />
          </div>
        </Dropdown>
      </li>
    </ul>
  );
};
