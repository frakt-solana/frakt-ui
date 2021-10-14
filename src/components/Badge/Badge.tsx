import React from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';

interface IBadgeProps {
  className?: string;
  onClick?: (args: any) => any;
  label: string;
}

const Badge = ({
  className,
  onClick = () => {},
  label,
}: IBadgeProps): JSX.Element => (
  <div className={classNames(className, styles.label)} onClick={onClick}>
    {label}
  </div>
);

export default Badge;
