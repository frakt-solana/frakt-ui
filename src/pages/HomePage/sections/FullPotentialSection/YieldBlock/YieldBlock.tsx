import { FC } from 'react';
import classNames from 'classnames/bind';

import styles from './YieldBlock.module.scss';
import { BlockContent } from '../BlockContent';
import {
  PercentIcon100,
  PercentIcon30,
  PercentIcon50,
  YieldInfoIcon,
} from '../../../svg';

interface YieldBlockProps {
  className?: string;
}

export const YieldBlock: FC<YieldBlockProps> = ({ className }) => {
  return (
    <div className={classNames(className, styles.block)}>
      <BlockContent
        title={'Earn'}
        icon={<YieldInfoIcon />}
        text={'Provide NFTs or liquidity to protocol and reap the rewards'}
      />
      <div className={styles.percentsWrapper}>
        <PercentIcon100 className={styles.percent100} />
        <PercentIcon50 className={styles.percent50} />
        <PercentIcon30 className={styles.percent30} />
      </div>
    </div>
  );
};
