import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { SearchInput } from '../../../components/SearchInput';
import { Select } from '../../../components/Select/Select';
import styles from './styles.module.scss';

interface SortValue {
  label: JSX.Element;
  value: string;
}

interface CollectionsFilterProps {
  sortVaules: SortValue[];
  searchItems: (value: string) => void;
  sortControl: Control<{
    sort: SortValue;
  }>;
}

export const CollectionsFilter: FC<CollectionsFilterProps> = ({
  sortVaules,
  searchItems,
  sortControl,
}) => {
  return (
    <div className={styles.wrapper}>
      <SearchInput
        onChange={(event) => searchItems(event.target.value || '')}
        className={styles.search}
        placeholder="Search by collection name"
      />
      <div className={styles.filtersWrapper}>
        <div>
          <Controller
            control={sortControl}
            name="sort"
            render={({ field: { ref, ...field } }) => (
              <Select
                className={styles.sortingSelect}
                valueContainerClassName={styles.sortingSelectValueContainer}
                label="Sort by"
                name="sort"
                options={sortVaules}
                {...field}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
