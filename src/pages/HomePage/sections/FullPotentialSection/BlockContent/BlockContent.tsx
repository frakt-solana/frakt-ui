import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom';

interface BlockContentProps {
  className?: string;
  icon: JSX.Element;
  title: string;
  text: string;
  buttonTo?: string;
  disabled?: boolean;
}

export const BlockContent: FC<BlockContentProps> = ({
  className,
  icon,
  title,
  text,
  buttonTo = '',
  disabled = false,
}) => {
  return (
    <div className={classNames(className, styles.wrapper)}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      {disabled ? (
        <NavLink
          to={buttonTo}
          className={classNames(
            styles.button,
            styles.buttonDisabled,
            'common-accent-btn',
          )}
        >
          Soon
        </NavLink>
      ) : (
        <NavLink
          to={buttonTo}
          className={classNames(styles.button, 'common-accent-btn')}
        >
          Try it out
        </NavLink>
      )}
    </div>
  );
};
