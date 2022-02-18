import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { PoolsInfoIcon } from '../../../../../icons';
import { BlockContent } from '../BlockContent';

interface PoolsBlockProps {
  className?: string;
}

export const PoolsBlock: FC<PoolsBlockProps> = ({ className }) => {
  return (
    <div className={classNames(className, styles.block)}>
      <BlockContent
        title={'Pools'}
        icon={<PoolsInfoIcon />}
        text={'Instantly buy, sell and swap NFTs'}
      />
    </div>
  );
};
