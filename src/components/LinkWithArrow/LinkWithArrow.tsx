import classNames from 'classnames/bind';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRightTop } from '../../icons';

import styles from './LinkWithArrow.module.scss';

interface LinkWithArrowProps {
  externalLink?: boolean;
  to: string;
  label: string;
  className?: string;
}

export const LinkWithArrow: FC<LinkWithArrowProps> = ({
  externalLink,
  to,
  label,
  className,
}) => {
  return externalLink ? (
    <a
      className={classNames(styles.root, className)}
      href={to}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
      <ArrowRightTop className={styles.icon} />
    </a>
  ) : (
    <NavLink className={classNames(styles.root, className)} to={to}>
      {label}
      <ArrowRightTop className={styles.icon} />
    </NavLink>
  );
};
