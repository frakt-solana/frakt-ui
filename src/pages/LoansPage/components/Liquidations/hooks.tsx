import { useState } from 'react';
import { Control, useForm } from 'react-hook-form';

import { ArrowDownSmallIcon } from '../../../../icons';
import styles from './Liquidations.module.scss';
import { useDebounce } from '../../../../hooks';
import { Tab, useTabs } from '../../../../components/Tabs';

enum LiquidationsListFormNames {
  SORT = 'sort',
  COLLECTIONS_SORT = 'collections',
}

export enum LiquidationsTabsNames {
  LIQUIDATIONS = 'liquidations',
  RAFFLES = 'raffles',
  GRACE = 'grace',
}

export type LiquiditionsSortValue = {
  label: JSX.Element;
  value: string;
};

export type FilterFormFieldsValues = {
  [LiquidationsListFormNames.SORT]: LiquiditionsSortValue;
  [LiquidationsListFormNames.COLLECTIONS_SORT]: LiquiditionsSortValue;
};

export const useLiquidationsPage = (): {
  control: Control<FilterFormFieldsValues>;
  setSearch: (value?: string) => void;
  liquidationTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
} => {
  const [_, setSearchString] = useState<string>('');

  const {
    tabs: liquidationTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LIQUIDATIONS_TABS,
    defaultValue: LIQUIDATIONS_TABS[0].value,
  });

  const { control, watch } = useForm({
    defaultValues: {
      [LiquidationsListFormNames.SORT]: SORT_VALUES[0],
      [LiquidationsListFormNames.COLLECTIONS_SORT]: null,
    },
  });

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  return {
    control,
    setSearch: searchDebounced,
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

export const SORT_COLLECTIONS_VALUES: LiquiditionsSortValue[] = [
  {
    label: <span className={styles.sortName}>Degen Ape</span>,
    value: 'Degen_Ape',
  },
  {
    label: <span className={styles.sortName}>Okay Bears</span>,
    value: 'Okay_bears',
  },
  {
    label: <span className={styles.sortName}>Carton Kids</span>,
    value: 'carton_kids',
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
