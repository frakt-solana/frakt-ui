import { useState } from 'react';
import { Control, useForm } from 'react-hook-form';

import { Tab, useTabs } from '../../../components/Tabs';
import { ArrowDownSmallIcon } from '../../../icons';
import styles from '../LoansPage.module.scss';
import { useDebounce } from '../../../hooks';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

export enum LoanTabsNames {
  LENDING = 'lending',
  LIQUIDATIONS = 'liquidations',
  LOANS = 'loans',
}

export type SortValue = {
  label: JSX.Element;
  value: string;
};

export type FormFieldValues = {
  [InputControlsNames.SHOW_STAKED]: boolean;
  [InputControlsNames.SORT]: SortValue;
};

export const useLoansPage = (): {
  formControl: Control<FormFieldValues>;
  loanTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
  searchItems: (value?: string) => void;
} => {
  const { control } = useForm({
    defaultValues: {
      [InputControlsNames.SHOW_STAKED]: false,
      [InputControlsNames.SORT]: SORT_VALUES[0],
    },
  });
  const {
    tabs: loanTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LOANS_TABS,
    defaultValue: LOANS_TABS[0].value,
  });
  const [, setSearchString] = useState<string>('');

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  return {
    formControl: control,
    searchItems,
    loanTabs,
    tabValue,
    setTabValue,
  };
};

const LOANS_TABS: Tab[] = [
  {
    label: 'Lending',
    value: 'lending',
  },
  {
    label: 'Liquidations',
    value: 'liquidations',
    disabled: true,
  },
  {
    label: 'My loans',
    value: 'loans',
  },
];

export const SORT_VALUES: SortValue[] = [
  {
    label: (
      <span>
        Price <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'price_desc',
  },
  {
    label: (
      <span>
        Price <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'price_asc',
  },
];
