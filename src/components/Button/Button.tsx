import styles from './styles.module.scss';
import classNames from 'classnames/bind';
import React from 'react';
import { Link } from 'react-router-dom';

interface IButtonRegularProps {
  className?: string;
  disabled?: boolean;
  isLink?: boolean;
  linkAttrs?: any;
  onClick?: (args: any) => any;
  size?: string;
  Icon?: any;
  children: any;
  type?: 'primary' | 'secondary' | 'alternative';
  href?: string;
}

const getIcon = ({ Icon }) => {
  return Icon ? <Icon size={14} /> : '';
};

const Button = ({
  className,
  disabled = false,
  isLink = false,
  linkAttrs,
  onClick = () => {},
  size = 'md',
  type = 'primary',
  Icon,
  children,
}: IButtonRegularProps): JSX.Element => {
  if (isLink) {
    return (
      <Link
        className={classNames([
          styles.root,
          styles.link,
          className,
          { [styles.disabled]: disabled },
          styles[size],
          styles[type],
        ])}
        {...linkAttrs}
      >
        {getIcon({ Icon })}
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classNames([
        styles.root,
        className,
        { [styles.disabled]: disabled },
        styles[size],
        styles[type],
      ])}
      onClick={onClick}
    >
      {getIcon({ Icon })}
      {children}
    </button>
  );
};

export default Button;
