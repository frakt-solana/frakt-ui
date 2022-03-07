import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';

import { NFTsList, NFTsListProps } from '../NFTsList';
import { Select } from '../../../../components/Select/Select';
import { ArrowDownSmallIcon, FiltersIcon } from '../../../../icons';
import { pluralize } from '../../../../utils';
import styles from './MarketNFTsList.module.scss';
import {
  FilterFormFieldsValues,
  FilterFormInputsNames,
  NftSortValue,
} from '../../model';

interface MarketNFTsList extends NFTsListProps {
  control: Control<FilterFormFieldsValues>;
  setIsSidebar: (nextValue: boolean) => void;
  sortFieldName: FilterFormInputsNames;
  sortValues: NftSortValue[];
}

export const MarketNFTsList: FC<MarketNFTsList> = ({
  nfts,
  setIsSidebar,
  control,
  sortFieldName,
  sortValues,
  onCardClick,
  selectedNft,
}) => {
  return (
    <div className={styles.marketNFTsList}>
      <div className={styles.itemsSortWrapper}>
        <p
          className={styles.filtersIconWrapper}
          onClick={() => setIsSidebar(true)}
        >
          Filters
          <FiltersIcon />
        </p>
        <div className={styles.itemsAmount}>
          {pluralize(nfts.length, 'item')}
        </div>
        <div className={styles.sortWrapper}>
          <Controller
            control={control}
            name={sortFieldName}
            render={({ field: { ref, ...field } }) => (
              <Select
                className={styles.sortingSelect}
                valueContainerClassName={styles.sortingSelectValueContainer}
                label="Sort by"
                name={sortFieldName}
                options={sortValues}
                {...field}
              />
            )}
          />
        </div>
      </div>
      <NFTsList
        nfts={nfts}
        onCardClick={onCardClick}
        selectedNft={selectedNft}
      />
    </div>
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
