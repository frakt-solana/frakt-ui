import { FC, useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { ArrowDownSmallIcon } from '../../../icons';
import { Select } from '../../../components/Select/Select';
import { PoolsList } from './components/PoolsList';
import { AppLayout } from '../../../components/Layout/AppLayout';
import {
  useNftPools,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../../contexts/nftPools';
import styles from './NFTPoolsPage.module.scss';
import { Loader } from '../../../components/Loader';
import { CommunityPoolState } from '../../../utils/cacher/nftPools';
import { Container } from '../../../components/Layout';
import { SearchInput } from '../../../components/SearchInput';
import { useTokenListContext } from '../../../contexts/TokenList';
import { TokenInfo } from '@solana/spl-token-registry';
import { usePoolTokensPrices } from '../hooks';
import { usePoolsFiltering } from './hooks';

export const NFTPoolsPage: FC = () => {
  const { pools: rawPools, loading: poolsLoading } = useNftPools();
  const { loading: tokensMapLoading, fraktionTokensMap } =
    useTokenListContext();

  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const poolTokens = useMemo(() => {
    if (rawPools.length && fraktionTokensMap.size) {
      return rawPools.reduce((poolTokens: TokenInfo[], pool) => {
        const poolTokenMint = pool?.fractionMint?.toBase58();
        const tokenInfo = fraktionTokensMap.get(poolTokenMint);

        if (tokenInfo) {
          return [...poolTokens, tokenInfo];
        }

        return poolTokens;
      }, []);
    }

    return [];
  }, [rawPools, fraktionTokensMap]);

  const {
    pricesByTokenMint: poolTokenPricesByTokenMint,
    loading: pricesLoading,
  } = usePoolTokensPrices(poolTokens);

  const activePools = useMemo(() => {
    return rawPools.filter(
      ({ state /* publicKey */ }) => state === CommunityPoolState.ACTIVE,
      // && publicKey.toBase58() === 'Gsyy57YjrRzKiFa6p5T6BBXmoGB3qEo8Q1hewijLRRWm',
    );
  }, [rawPools]);

  const { control, pools, setSearch } = usePoolsFiltering({
    pools: activePools,
    poolTokens,
  });

  const loading = tokensMapLoading || poolsLoading || pricesLoading;

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Pools</h1>
        <h2 className={styles.subtitle}>Buy, sell, and swap NFTs instantly</h2>

        <div className={styles.searchWrapper}>
          <SearchInput
            onChange={(event) => setSearch(event.target.value || '')}
            className={styles.searchInput}
            placeholder="Search by pool name"
          />
          <div className={styles.sortWrapper}>
            <Controller
              control={control}
              name="sort"
              render={({ field: { ref, ...field } }) => (
                <Select
                  className={styles.sortingSelect}
                  valueContainerClassName={styles.sortingSelectValueContainer}
                  label="Sort by"
                  name="sort"
                  options={SORT_VALUES}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        {loading ? (
          <Loader size="large" />
        ) : (
          <PoolsList
            pools={pools}
            tokensMap={fraktionTokensMap}
            poolTokenPricesByTokenMint={poolTokenPricesByTokenMint}
          />
        )}
      </Container>
    </AppLayout>
  );
};

export const SORT_VALUES = [
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'name_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'name_desc',
  },
];
