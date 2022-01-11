import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';

interface NavigationLinkProps {
  to: string;
  children?: null | JSX.Element | JSX.Element[] | string;
  isActive?: (match?: any, location?: any) => boolean;
}

const NavigationLink = ({
  to,
  isActive,
  children,
}: NavigationLinkProps): JSX.Element => {
  return (
    <NavLink
      to={to}
      className={styles.link}
      activeClassName={styles.activeLink}
      isActive={isActive}
    >
      {children}
    </NavLink>
  );
};

export default NavigationLink;
