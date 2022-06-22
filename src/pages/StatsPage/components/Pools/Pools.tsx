import { FC } from 'react';

import styles from './Pools.module.scss';
import PoolsRaw from '../PoolsRaw';
import Block from '../Block';

interface PoolsProps {
  poolsInfo?: any[];
}

const Pools: FC<PoolsProps> = ({ poolsInfo }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Pools</h2>
      <Block className={styles.block}>
        <div className={styles.poolsConainer}>
          <PoolsRaw data={poolsInfo} title={'NFT pools TVL'} />
          <div className={styles.line} />
          <PoolsRaw data={poolsInfo} title={'NFT pools Volume'} />
        </div>
      </Block>
    </div>
  );
};

export default Pools;
