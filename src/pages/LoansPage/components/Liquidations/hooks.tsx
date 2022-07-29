import { useEffect, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { compose, join, pluck } from 'ramda';

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
  setCollections: (value?: []) => void;
};

export const useLiquidationsPage: UseLiquidationsPage = (
  fetchItemsFunc: FetchDataFunc,
) => {
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [sortBy, setSortBy] = useState<string>('liquidationPrice');
  const [search, setSearch] = useState<string>('');
  const [collections, setCollections] = useState<[]>([]);
  const stringRef = useRef(null);

  const { control, watch } = useForm({
    defaultValues: {
      [LiquidationsListFormNames.SORT]: SORT_VALUES[3],
      [LiquidationsListFormNames.COLLECTIONS_SORT]: null,
    },
  });

  const sort = watch(LiquidationsListFormNames.SORT);

  const fetchItems = (params = {}): void => {
    const query = {
      sortBy,
      sort: sortOrder,
      search: stringRef.current,
      collections: compose(
        decodeURIComponent,
        join(','),
        pluck('value'),
      )(collections),
      ...params,
    };
    fetchItemsFunc(query);
  };

  const searchDebounced = useDebounce((search: string): void => {
    stringRef.current = search;
    fetchItems();
  }, 300);

  useEffect(() => {
    const [sortField, sortOrder] = sort.value.split('_');

    setSortBy(sortField);
    setSortOrder(sortOrder);

    fetchItems({ sortBy: sortField, sort: sortOrder });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    searchDebounced(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

  return {
    control,
    setSearch,
    setCollections,
  };
};

export const SORT_VALUES: LiquiditionsSortValue[] = [
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'nftName_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'nftName_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Liquidation Price <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'liquidationPrice_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Liquidation Price <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'liquidationPrice_desc',
  },
];

export const LIQUIDATIONS_TABS: Tab[] = [
  {
    label: 'Ongoing raffles',
    value: 'liquidations',
  },
  {
    label: 'Grace List',
    value: 'grace',
  },
  {
    label: 'Raffles I won',
    value: 'raffles',
  },
];
