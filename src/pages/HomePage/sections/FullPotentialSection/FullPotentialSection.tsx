import React, { FC } from 'react';
import styles from './styles.module.scss';
import { FraktionalizationBlock } from './FraktionalizationBlock';
import { PoolsBlock } from './PoolsBlock';
import { LendingBlock } from './LendingBlock';
import { YieldBlock } from './YieldBlock';
import classNames from 'classnames';
import { OUR_PRODUCT_ID } from '../../constants';

interface FullPotentialSectionProps {
  className?: string;
  navRef?: { current: HTMLParagraphElement };
}

export const FullPotentialSection: FC<FullPotentialSectionProps> = ({
  className,
  navRef,
}) => {
  return (
    <section className={`${className} section`}>
      <p className="itemForIntersectionMenu" id={OUR_PRODUCT_ID} ref={navRef}>
        Our products
      </p>
      <div className="container">
        <h2 className={styles.title}>Unlock the full potential of your NFTs</h2>
        <FraktionalizationBlock className={styles.block} />
        <PoolsBlock className={classNames(styles.block, styles.blockRight)} />
        <LendingBlock className={styles.block} />
        <YieldBlock
          className={classNames(
            styles.block,
            styles.blockRight,
            styles.blockBg,
          )}
        />
      </div>
    </section>
  );
};
