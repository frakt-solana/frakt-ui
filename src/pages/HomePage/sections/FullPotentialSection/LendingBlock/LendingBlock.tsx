import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { LandingInfoIcon } from '../../../../../icons';
import { BlockContent } from '../BlockContent';

interface LendingBlockProps {
  className?: string;
}

export const LendingBlock: FC<LendingBlockProps> = ({ className }) => {
  return (
    <div className={classNames(className, styles.block)}>
      <BlockContent
        title={'Lending & Borrowing'}
        icon={<LandingInfoIcon />}
        disabled
        text={
          'Get instant loans against NFTs. Get money for Solana NFTs and return them back anytime'
        }
      />
    </div>
  );
};
