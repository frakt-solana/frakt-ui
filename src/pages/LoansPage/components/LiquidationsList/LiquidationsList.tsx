import { FC, ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { TicketsRefillCountdown } from '../TicketsRefillCountdown';
import {
  SORT_COLLECTIONS_VALUES,
  SORT_VALUES,
  useLiquidationsPage,
} from '../Liquidations';
import { SearchInput } from '../../../../components/SearchInput';
import { Select } from '../../../../components/Select';
import styles from './LiquidationsList.module.scss';
import { TicketsCounter } from '../TicketsCounter';
import { CollectionDropdown } from '../../../../components/CollectionDropdown';
import { selectLotteryTickets } from '../../../../state/liquidations/selectors';

interface LiquidationsListProps {
  children: ReactNode;
  withRafflesInfo?: boolean;
}

const LiquidationsList: FC<LiquidationsListProps> = ({
  children,
  withRafflesInfo,
}) => {
  const { control, setSearch } = useLiquidationsPage();
  const lotteryTickets = useSelector(selectLotteryTickets);

  return (
    <>
      <div className={styles.searchWrapper}>
        <SearchInput
          onChange={(event) => setSearch(event.target.value || '')}
          className={styles.searchInput}
          placeholder="Search by name"
        />
        {withRafflesInfo && (
          <div className={styles.rafflesInfo}>
            <TicketsCounter tickets={lotteryTickets.quantity} />
            {/* <TicketsRefillCountdown /> */}
          </div>
        )}
        <div className={styles.sortWrapper}>
          <Controller
            control={control}
            name="collections"
            render={({ field: { ref, ...field } }) => (
              <CollectionDropdown
                className={styles.sortingSelect}
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
      </div>
      {children}
    </>
  );
};

export default LiquidationsList;
