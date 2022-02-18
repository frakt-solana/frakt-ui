import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { FraktionalizationInfoIcon } from '../../../../../icons';

interface FraktionalizationBlockProps {
  className?: string;
}

export const FraktionalizationBlock: FC<FraktionalizationBlockProps> = ({
  className,
}) => {
  return (
    <div className={classNames(className, styles.block)}>
      <FraktionalizationInfoIcon />
    </div>
  );
};
