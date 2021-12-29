import { FC } from 'react';
import { Control } from 'react-hook-form';
import { SearchInput } from '../../../components/SearchInput';
import { ControlledSelect } from '../../../components/Select/Select';
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
        size="large"
        onChange={(event) => searchItems(event.target.value || '')}
        className={styles.search}
        placeholder="Search by collection name"
      />
      <div className={styles.filtersWrapper}>
        <div>
          <ControlledSelect
            className={styles.sortingSelect}
            valueContainerClassName={styles.sortingSelectValueContainer}
            label="Sort by"
            control={sortControl}
            name="sort"
            options={sortVaules}
          />
        </div>
      </div>
    </div>
  );
};
