import { FC } from 'react';

import { NftPoolData } from '../../../../utils/cacher/nftPools';
import styles from './styles.module.scss';
import { PoolCard } from '../PoolCard';

interface PoolsList {
  pools: NftPoolData[];
}

export const PoolsList: FC<PoolsList> = ({ pools }) => {
  return (
    <ul className={styles.poolsList}>
      {pools.map((pool) => (
        <PoolCard key={pool.publicKey.toBase58()} pool={pool} />
      ))}
    </ul>
  );
};
