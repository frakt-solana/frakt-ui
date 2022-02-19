import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { LandingInfoIcon, SolanaIcon } from '../../../../../icons';
import { BlockContent } from '../BlockContent';
import imageOne from '../../../images/landing1.png';
import imageTwo from '../../../images/landing2.png';

interface LendingBlockProps {
  className?: string;
}

export const LendingBlock: FC<LendingBlockProps> = ({ className }) => {
  return (
    <div className={classNames(className, styles.block)}>
      <div className={styles.imagesWrapper}>
        <div className={classNames(styles.image, styles.imageOne)}>
          <img src={imageOne} alt="" />
        </div>
        <div className={classNames(styles.image, styles.imageTwo)}>
          <img src={imageTwo} alt="" />
          <div className={styles.infoWrapper}>
            <p className={styles.infoTitle}>TYR-1281</p>
            <p className={styles.infoPrice}>
              100
              <SolanaIcon />
              SOL
            </p>
          </div>
        </div>
      </div>
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
