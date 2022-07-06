import { useEffect, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { liquidationsActions } from '../../../../state/liquidations/actions';
import { Tab, useTabs } from '../../../../components/Tabs';
import { ArrowDownSmallIcon } from '../../../../icons';
import styles from './Liquidations.module.scss';
import { useDebounce } from '../../../../hooks';
import {
  FilterFormFieldsValues,
  LiquidationsListFormNames,
  LiquiditionsSortValue,
} from '../../model';

type UseLiquidationsPage = () => {
  control: Control<FilterFormFieldsValues>;
  setSearch: (value?: string) => void;
  liquidationTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
};

export const useLiquidationsPage: UseLiquidationsPage = () => {
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
  const dispatch = useDispatch();

  const {
    tabs: liquidationTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LIQUIDATIONS_TABS,
    defaultValue: LIQUIDATIONS_TABS[0].value,
  });

  const fetchGraceList = () => {
    dispatch(
      liquidationsActions.fetchGraceList({
        sortBy,
        sortOrder,
        searchStr: stringRef.current,
      }),
    );
  };

  const searchDebounced = useDebounce((search: string) => {
    stringRef.current = search;
    fetchGraceList();
  }, 300);

  useEffect(() => {
    const [sortField, sortOrder] = sort.value.split('_');

    setSortBy(sortField);
    setSortOrder(sortOrder);

    fetchGraceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    searchDebounced(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return {
    control,
    setSearch,
    liquidationTabs,
    tabValue,
    setTabValue,
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

export const SORT_COLLECTIONS_VALUES: LiquiditionsSortValue[] = [
  {
    label: <span className={styles.sortName}>Degen Ape</span>,
    value: 'Degen_Ape',
  },
  {
    label: <span className={styles.sortName}>Okay Bears</span>,
    value: 'Okay_bears',
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
