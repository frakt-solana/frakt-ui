import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import {
  PercentIcon100,
  PercentIcon30,
  PercentIcon50,
  YieldInfoIcon,
} from '../../../../../icons';
import { BlockContent } from '../BlockContent';

interface YieldBlockProps {
  className?: string;
}

export const YieldBlock: FC<YieldBlockProps> = ({ className }) => {
  return (
    <div className={classNames(className, styles.block)}>
      <BlockContent
        title={'Yield'}
        icon={<YieldInfoIcon />}
        text={
          'Provide NFTs or liquidity to protocol and to the NFT pools & vaults and reap the rewards'
        }
      />
      <div className={styles.percentsWrapper}>
        <PercentIcon100 className={styles.percent100} />
        <PercentIcon50 className={styles.percent50} />
        <PercentIcon30 className={styles.percent30} />
      </div>
    </div>
  );
};
