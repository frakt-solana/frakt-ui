import { forwardRef, RefObject } from 'react';
import { Control, Controller } from 'react-hook-form';
import classNames from 'classnames';

import { NFTsList, NFTsListProps } from '../NFTsList';
import { Select } from '../../../../components/Select/Select';
import { ArrowDownSmallIcon } from '../../../../icons';
import { pluralize } from '../../../../utils';
import styles from './NFTPoolNFTsList.module.scss';
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
  poolName?: string;
  className?: string;
}

export const NFTPoolNFTsList = forwardRef(
  (
    {
      nfts,
      control,
      sortFieldName,
      sortValues,
      onCardClick,
      selectedNft,
      poolName = '',
      className,
    }: MarketNFTsList,
    ref: RefObject<HTMLDivElement>,
  ) => {
    return (
      <div ref={ref} className={classNames(styles.marketNFTsList, className)}>
        <div className={styles.itemsSortWrapper}>
          {!!poolName && <p className={styles.poolName}>{poolName}</p>}
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
  },
);

NFTPoolNFTsList.displayName = 'NFTPoolNFTsList';

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
