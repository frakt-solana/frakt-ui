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
  soon?: boolean;
  externalLink?: boolean;
}

export const BlockContent: FC<BlockContentProps> = ({
  className,
  icon,
  title,
  text,
  to = '',
  soon = false,
  externalLink = false,
}) => {
  return (
    <div className={classNames(className, styles.wrapper)}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      {soon && (
        <Button type="alternative" className={styles.btn} disabled>
          Soon
        </Button>
      )}
      {!!to && !externalLink && (
        <NavLink to={to}>
          <Button type="alternative" className={styles.btn}>
            Try it out
          </Button>
        </NavLink>
      )}
      {!!to && externalLink && (
        <a href={to} target="_blank" rel="noreferrer">
          <Button type="alternative" className={styles.btn}>
            Try it out
          </Button>
        </a>
      )}
    </div>
  );
};
