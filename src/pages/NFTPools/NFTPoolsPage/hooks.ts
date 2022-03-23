import { TokenInfo } from '@solana/spl-token-registry';
import { useCallback, useMemo, useState } from 'react';
import { Control, useForm } from 'react-hook-form';

import { useDebounce } from '../../../hooks';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import { FilterFormFieldsValues, FilterFormInputsNames } from '../model';
import { SORT_VALUES } from './NFTPoolsPage';

type UsePoolsFiltering = (params: {
  pools: NftPoolData[];
  poolTokens: TokenInfo[];
}) => {
  control: Control<FilterFormFieldsValues>;
  pools: NftPoolData[];
  setSearch: (value?: string) => void;
};

export const usePoolsFiltering: UsePoolsFiltering = ({
  pools = [],
  poolTokens = [],
}) => {
  const { control, watch } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: SORT_VALUES[0],
    },
  });

  const [searchString, setSearchString] = useState<string>('');

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const sort = watch(FilterFormInputsNames.SORT);

  const getPoolName = useCallback(
    (pool: NftPoolData) => {
      return (
        poolTokens
          .find(({ address }) => address === pool.fractionMint.toBase58())
          ?.name?.toUpperCase() || ''
      );
    },
    [poolTokens],
  );

  const filteredPools = useMemo(() => {
    if (pools.length && poolTokens.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return pools
        .filter((pool) => {
          const poolName = getPoolName(pool);

          return poolName.includes(searchString);
        })
        .sort((poolA, poolB) => {
          if (sortField === 'name') {
            if (sortOrder === 'asc')
              return getPoolName(poolA).localeCompare(getPoolName(poolB));
            return getPoolName(poolB).localeCompare(getPoolName(poolA));
          }
          return 0;
        });
    }

    return [];
  }, [pools, sort, searchString, poolTokens, getPoolName]);

  return { control, pools: filteredPools, setSearch: searchDebounced };
};
