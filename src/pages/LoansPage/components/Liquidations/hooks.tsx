import { useEffect, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';

import { Tab } from '../../../../components/Tabs';
import { ArrowDownSmallIcon } from '../../../../icons';
import styles from '../LiquidationsList/LiquidationsList.module.scss';
import { useDebounce } from '../../../../hooks';
import {
  FilterFormFieldsValues,
  LiquidationsListFormNames,
  LiquiditionsSortValue,
} from '../../model';
import { FetchItemsParams } from '../../../../state/liquidations/types';

type FetchDataFunc = (params: FetchItemsParams) => void;

type UseLiquidationsPage = (fetchItemsFunc: FetchDataFunc) => {
  control: Control<FilterFormFieldsValues>;
  setSearch: (value?: string) => void;
};

export const useLiquidationsPage: UseLiquidationsPage = (
  fetchItemsFunc: FetchDataFunc,
) => {
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [sortBy, setSortBy] = useState<string>('nftName');
  const [search, setSearch] = useState<string>('');
  const stringRef = useRef(null);

  const { control, watch } = useForm({
    defaultValues: {
      [LiquidationsListFormNames.SORT]: SORT_VALUES[0],
      [LiquidationsListFormNames.COLLECTIONS_SORT]: null,
    },
  });

  const sort = watch(LiquidationsListFormNames.SORT);

  const fetchItems = (): void => {
    const rawSearchStr = stringRef.current
      ? `search=${stringRef.current}&`
      : '';
    const rawSortBy = sortBy ? `sortBy=${sortBy}&` : '';
    const rawSortOrder = sortOrder ? `sort=${sortOrder}&` : '';

    fetchItemsFunc({
      sortBy: rawSortBy,
      sortOrder: rawSortOrder,
      searchStr: rawSearchStr,
    });
  };

  const searchDebounced = useDebounce((search: string): void => {
    stringRef.current = search;
    fetchItems();
  }, 300);

  useEffect(() => {
    const [sortField, sortOrder] = sort.value.split('_');

    setSortBy(sortField);
    setSortOrder(sortOrder);

    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    searchDebounced(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return {
    control,
    setSearch,
  };
};

export const SORT_VALUES: LiquiditionsSortValue[] = [
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'nftName_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'nftName_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Liquidation Price <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'liquidationPrice_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Liquidation Price <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'liquidationPrice_desc',
  },
];

export const LIQUIDATIONS_TABS: Tab[] = [
  {
    label: 'Liquidations raffle',
    value: 'liquidations',
  },
  {
    label: 'Grace List',
    value: 'grace',
  },
  {
    label: 'Won raffles',
    value: 'raffles',
  },
];
