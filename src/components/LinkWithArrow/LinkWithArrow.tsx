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
  invert?: boolean;
}

export const LinkWithArrow: FC<LinkWithArrowProps> = ({
  externalLink,
  to,
  label,
  className,
  invert,
}) => {
  return externalLink ? (
    <a
      className={classNames(styles.root, className, {
        [styles.invert]: invert,
      })}
      href={to}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
      <ArrowRightTop
        className={styles.icon}
        fill={invert ? 'black' : 'white'}
      />
    </a>
  ) : (
    <NavLink
      className={classNames(styles.root, className, {
        [styles.invert]: invert,
      })}
      to={to}
    >
      {label}
      <ArrowRightTop
        className={styles.icon}
        fill={invert ? 'black' : 'white'}
      />
    </NavLink>
  );
};
