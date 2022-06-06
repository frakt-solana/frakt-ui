import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { SearchInput } from '../../../../components/SearchInput';
import { FilterFormInputsNames } from '../../../NFTPools/model';
import { Select } from '../../../../components/Select';
import styles from './LiquidationsList.module.scss';
import { useDebounce } from '../../../../hooks';
import { ArrowDownSmallIcon } from '../../../../icons';
import TicketsCounter from '../TicketsCounter/TicketsCounter';
import TicketsRefillCountdown from '../TicketsRefillCountdown/TicketsRefillCountdown';
import CollectionDropdown from '../../../../components/CollectionDropdown/CollectionDropdown';

enum LiquidationsListFormNames {
  SORT = 'sort',
  COLLECTIONS_SORT = 'collections',
}

const LiquidationsList = ({ children }) => {
  const [searchString, setSearchString] = useState<string>('');

  const { control, watch } = useForm({
    defaultValues: {
      [LiquidationsListFormNames.SORT]: SORT_VALUES[0],
      [LiquidationsListFormNames.COLLECTIONS_SORT]: null,
    },
  });

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  return (
    <>
      <div className={styles.searchWrapper}>
        <>
          <SearchInput
            onChange={(event) => searchDebounced(event.target.value || '')}
            className={styles.searchInput}
            placeholder="Search by name"
          />
          <div className={styles.rafflesInfo}>
            <TicketsCounter tickets={'25'} />
            <TicketsRefillCountdown />
          </div>

          <div className={styles.sortWrapper}>
            <Controller
              control={control}
              name="collections"
              render={({ field: { ref, ...field } }) => (
                <CollectionDropdown
                  className={styles.sortingSelect}
                  valueContainerClassName={styles.sortingSelectValueContainer}
                  name="collections"
                  options={SORT_COLLECTIONS_VALUES}
                  {...field}
                />
              )}
            />
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
        </>
      </div>
      {children}
    </>
  );
};

export default LiquidationsList;

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

export const SORT_COLLECTIONS_VALUES = [
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
