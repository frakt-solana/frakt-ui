import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { LandingInfoIcon } from '../../../../../icons';

interface LendingBlockProps {
  className?: string;
}

export const LendingBlock: FC<LendingBlockProps> = ({ className }) => {
  return (
    <div className={classNames(className, styles.block)}>
      <LandingInfoIcon />
    </div>
  );
};
