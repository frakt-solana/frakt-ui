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
  withoutLinks?: boolean;
  children: ReactElement;
}

export const DropdownMenuMore: FC = () => {
  return (
    <Dropdown title="More">
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
    </Dropdown>
  );
};

export const DropdownMenuDoStuff: FC = () => {
  return (
    <Dropdown title="Do stuff">
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
          <a href={PATHS.BORROW} className={styles.link}>
            <div className={styles.content}>
              <p className={styles.title}>Borrow</p>
              <p className={styles.subtitle}>
                take loan using NFT as collateral
              </p>
            </div>
          </a>
        </li>
      </ul>
    </Dropdown>
  );
};

export const AppNavigation: FC<AppNavigationProps> = ({
  className,
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
      {!withoutLinks && (
        <li className={styles.navigationItem}>
          <a className={styles.navigationLink} href={PATHS.BORROW}>
            Loans
          </a>
        </li>
      )}
      {!withoutLinks &&
        NAVIGATION_LINKS.map(({ label, to }, idx) => (
          <li key={idx} className={styles.navigationItem}>
            <NavigationLink to={to}>{label}</NavigationLink>
          </li>
        ))}
      {children}
    </ul>
  );
};
