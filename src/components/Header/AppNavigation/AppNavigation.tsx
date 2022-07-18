import { FC, ReactElement } from 'react';
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
          <a
            className={styles.dropdownLink}
            href={process.env.FRAKT_POOLS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pools
          </a>
        </li>
        <li>
          <a
            className={styles.dropdownLink}
            href={process.env.FRAKT_VAULTS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vaults
          </a>
        </li>
        <li>
          <a
            className={styles.dropdownLink}
            href={process.env.FRAKT_STAKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Staking
          </a>
        </li>
        <li>
          <a
            className={styles.dropdownLink}
            href={PATHS.ROADMAP}
            target="_blank"
            rel="noopener noreferrer"
          >
            Roadmap
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
