import { FC } from 'react';

import { NftPoolData } from '../../../../../utils/cacher/nftPools';
import styles from './PoolsList.module.scss';
import { PoolCard } from '../PoolCard';
import InfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../../components/InfinityScroll';
import { TokenInfo } from '@solana/spl-token-registry';
import { PricesByTokenMint } from '../../../hooks';

interface PoolsList {
  pools: NftPoolData[];
  tokensMap: Map<string, TokenInfo>;
  poolTokenPricesByTokenMint: PricesByTokenMint;
}

export const PoolsList: FC<PoolsList> = ({
  pools,
  tokensMap,
  poolTokenPricesByTokenMint,
}) => {
  const { itemsToShow, next } = useFakeInfinityScroll(15);

  return (
    <InfinityScroll
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
          price={
            poolTokenPricesByTokenMint.get(pool?.fractionMint?.toBase58())?.buy
          }
        />
      ))}
    </InfinityScroll>
  );
};
