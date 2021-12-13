import React from 'react';
import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom';
import { URLS } from '../../constants';
import { ArrowLeftIcon } from '../../icons';
import classNames from 'classnames';

interface BackToSearchButtonProps {
  className?: string;
}

export const BackToVaultsListButton = ({
  className,
}: BackToSearchButtonProps): JSX.Element => {
  return (
    <div className={classNames([className, styles.buttonWrapper])}>
      <NavLink className={styles.backLink} to={URLS.VAULTS}>
        <ArrowLeftIcon className={styles.arrowIcon} />
        Back to Vaults list
      </NavLink>
    </div>
  );
};
