import React from 'react';
import { Helmet } from 'react-helmet';

import styles from './styles.module.scss';
import { ArrowDownSmallIcon } from '../../icons';
import { ControlledSelect } from '../../components/Select/Select';
import { useForm } from 'react-hook-form';

import { Sidebar } from './components/Sidebar';
import { NFTsList } from './components/NFTsList';
import { AppLayout } from '../../components/Layout/AppLayout';
import { HeaderBuy } from './components/HeaderBuy';
import { HeaderStateProvider } from '../../contexts/HeaderState';
import { BuyingModal } from './components/BuyingModal';

const SORT_VALUES = [
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'collectionName_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'collectionName_desc',
  },
];

const MarketBuyPage = (): JSX.Element => {
  const { control, watch } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });

  const sort = watch('sort');

  return (
    <HeaderStateProvider>
      <AppLayout className={styles.layout}>
        <div className={styles.modalWrapper}>
          <BuyingModal />
        </div>
        <div className="container_lg">
          <Helmet>
            <title>{`Market/Buy-NFT | FRAKT: A NFT-DeFi ecosystem on Solana`}</title>
          </Helmet>
          <div className={styles.wrapper}>
            <Sidebar />

            <div className={styles.content}>
              <HeaderBuy />

              <div className={styles.itemsSortWrapper}>
                <div className={styles.itemsAmount}>355 items</div>
                <div className={styles.sortWrapper}>
                  <ControlledSelect
                    className={styles.sortingSelect}
                    valueContainerClassName={styles.sortingSelectValueContainer}
                    label="Sort by"
                    control={control}
                    name="sort"
                    options={SORT_VALUES}
                  />
                </div>
              </div>

              <NFTsList />
            </div>
          </div>
        </div>
      </AppLayout>
    </HeaderStateProvider>
  );
};

export default MarketBuyPage;
