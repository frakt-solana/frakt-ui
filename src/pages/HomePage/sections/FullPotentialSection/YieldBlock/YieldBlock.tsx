import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { YieldInfoIcon } from '../../../../../icons';

interface YieldBlockProps {
  className?: string;
}

export const YieldBlock: FC<YieldBlockProps> = ({ className }) => {
  return (
    <div className={classNames(className, styles.block)}>
      <YieldInfoIcon />
    </div>
  );
};
