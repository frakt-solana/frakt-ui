import { FC } from 'react';

import { NftPoolData } from '../../../../../utils/cacher/nftPools';
import styles from './PoolsList.module.scss';
import { PoolCard } from '../PoolCard';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../../components/FakeInfinityScroll';
import { TokenInfo } from '@solana/spl-token-registry';

interface PoolsList {
  pools: NftPoolData[];
  tokensMap: Map<string, TokenInfo>;
  poolTokenPriceByTokenMint: Map<string, string>;
}

export const PoolsList: FC<PoolsList> = ({
  pools,
  tokensMap,
  poolTokenPriceByTokenMint,
}) => {
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
        <PoolCard
          key={pool.publicKey.toBase58()}
          pool={pool}
          poolTokenInfo={tokensMap.get(pool?.fractionMint?.toBase58())}
          price={poolTokenPriceByTokenMint.get(pool?.fractionMint?.toBase58())}
        />
      ))}
    </FakeInfinityScroll>
  );
};
