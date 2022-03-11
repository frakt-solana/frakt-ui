import { FC, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { DROPDOWN_EXTERNAL_LINKS, NAVIGATION_LINKS } from './constants';
import styles from './AppNavigation.module.scss';
import NavigationLink from '../NavigationLink';
import { PATHS } from '../../../constants';
import { Dropdown } from '../../Dropdown';

interface AppNavigationProps {
  className?: string;
  title: string;
  withoutLinks?: boolean;
  children: ReactElement;
}

export const dropdownMenuMore = (
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

export const dropdownMenuDoStuff = (
  <ul className={styles.list}>
    <li className={styles.linkList}>
      <NavLink className={styles.link} to={PATHS.FRAKTIONALIZE}>
        <div className={styles.content}>
          <p className={styles.title}>Create Vault</p>
          <p className={styles.subtitle}>
            fraktionalize single or multiple NFTs
          </p>
        </div>
      </NavLink>
    </li>
    <li className={styles.linkList}>
      <NavLink className={styles.link} to={PATHS.BORROW}>
        <div className={styles.content}>
          <p className={styles.title}>Borrow</p>
          <p className={styles.subtitle}>take loan using NFT as collateral</p>
        </div>
      </NavLink>
    </li>
  </ul>
);

export const AppNavigation: FC<AppNavigationProps> = ({
  className,
  title,
  withoutLinks,
  children,
}) => {
  return (
    <ul
      className={classNames(
        styles.navigation,
        styles.navigation_left,
        className,
      )}
    >
      {!withoutLinks &&
        NAVIGATION_LINKS.map(({ label, to }, idx) => (
          <li key={idx} className={styles.navigationItem}>
            <NavigationLink to={to}>{label}</NavigationLink>
          </li>
        ))}
      <Dropdown title={title} dropdownMenu={children} />
    </ul>
  );
};
