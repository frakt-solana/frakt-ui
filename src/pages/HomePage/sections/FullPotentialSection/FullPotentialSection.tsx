import { FC } from 'react';
import classNames from 'classnames/bind';

import styles from './FullPotentialSection.module.scss';
import { FraktionalizationBlock } from './FraktionalizationBlock';
import { PoolsBlock } from './PoolsBlock';
import { LendingBlock } from './LendingBlock';
import { YieldBlock } from './YieldBlock';
import { OUR_PRODUCT_ID } from '../../constants';
import { Container } from '../../../../components/Layout';

interface FullPotentialSectionProps {
  navRef?: { current: HTMLParagraphElement };
}

export const FullPotentialSection: FC<FullPotentialSectionProps> = ({
  navRef,
}) => {
  return (
    <Container component="section" className={styles.root}>
      <h2 className={styles.title} id={OUR_PRODUCT_ID} ref={navRef}>
        Unlock the full potential of your NFTs
      </h2>
      <FraktionalizationBlock className={styles.block} />
      <PoolsBlock className={classNames(styles.block, styles.blockRight)} />
      <LendingBlock className={styles.block} />
      <YieldBlock
        className={classNames(styles.block, styles.blockRight, styles.blockBg)}
      />
    </Container>
  );
};
