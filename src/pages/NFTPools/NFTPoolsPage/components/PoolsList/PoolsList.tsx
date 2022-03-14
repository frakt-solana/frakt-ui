import { FC } from 'react';

import { NftPoolData } from '../../../../../utils/cacher/nftPools';
import styles from './PoolsList.module.scss';
import { PoolCard } from '../PoolCard';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../../components/FakeInfinityScroll';

interface PoolsList {
  pools: NftPoolData[];
}

export const PoolsList: FC<PoolsList> = ({ pools }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);

  return (
    <FakeInfinityScroll
      itemsToShow={itemsToShow}
      next={next}
      isLoading={false}
      wrapperClassName={styles.poolsList}
      emptyMessage="No NFT pools found"
    >
      {pools.map((pool) => (
        <PoolCard key={pool.publicKey.toBase58()} pool={pool} />
      ))}
    </FakeInfinityScroll>
  );
};
