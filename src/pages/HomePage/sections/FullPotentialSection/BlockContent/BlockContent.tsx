import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom';
import Button from '../../../../../components/Button';

interface BlockContentProps {
  className?: string;
  icon: JSX.Element;
  title: string;
  text: string;
  to?: string;
}

export const BlockContent: FC<BlockContentProps> = ({
  className,
  icon,
  title,
  text,
  to = '',
}) => {
  return (
    <div className={classNames(className, styles.wrapper)}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>

      {!to ? (
        <Button type="alternative" className={styles.btn} disabled>
          Soon
        </Button>
      ) : (
        <NavLink to={to}>
          <Button type="alternative" className={styles.btn}>
            Try it out
          </Button>
        </NavLink>
      )}
    </div>
  );
};
