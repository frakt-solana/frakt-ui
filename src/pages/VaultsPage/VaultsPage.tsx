import React, { useState, useMemo } from 'react';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import { useDebounce } from '../../hooks';
import { VaultState, useFraktion } from '../../contexts/fraktion';
import { useForm } from 'react-hook-form';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { ControlledSelect } from '../../components/Select/Select';
import ArrowDownSmallIcon from '../../icons/arrowDownSmall';
import { VaultsList } from '../../components/VaultsList';
import { Sidebar } from './components/Sidebar';
import { VaultsSlider } from './components/VaultsSlider';
import { FiltersIcon } from '../../icons';

const SORT_VALUES = [
  {
    label: <span>Newest</span>,
    value: 'createdAt_desc',
  },
  {
    label: <span>Oldest</span>,
    value: 'createdAt_asc',
  },
  {
    label: (
      <span>
        Supply <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'fractionsSupply_desc',
  },
  {
    label: (
      <span>
        Supply <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'fractionsSupply_asc',
  },
];

const VaultsPage = (): JSX.Element => {
  const { control, watch } = useForm({
    defaultValues: {
      showActiveVaults: true,
      showAuctionLiveVaults: false,
      showAuctionFinishedVaults: false,
      showArchivedVaults: false,
      showVerifiedVaults: true,
      showTradableVaults: false,
      sort: SORT_VALUES[0],
    },
  });
  const showActiveVaults = watch('showActiveVaults');
  const showAuctionLiveVaults = watch('showAuctionLiveVaults');
  const showAuctionFinishedVaults = watch('showAuctionFinishedVaults');
  const showVerifiedVaults = watch('showVerifiedVaults');
  const showArchivedVaults = watch('showArchivedVaults');
  const showTradableVaults = watch('showTradableVaults');
  const sort = watch('sort');
  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const { loading, vaults: rawVaults } = useFraktion();
  const [searchString, setSearchString] = useState<string>('');

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaults = useMemo(() => {
    const [sortField, sortOrder] = sort.value.split('_');
    return rawVaults
      .filter(({ state, hasMarket, safetyBoxes, isVerified }) => {
        const nftsName =
          safetyBoxes?.map((nft) => nft.nftName.toUpperCase()) || [];

        //? Filter out unfinished vaults
        if (state === VaultState.Inactive) return false;

        const removeActiveVaults =
          !showActiveVaults && state === VaultState.Active;
        const removeLiveVaults =
          !showAuctionLiveVaults && state === VaultState.AuctionLive;
        const removeFinishedVaults =
          !showAuctionFinishedVaults && state === VaultState.AuctionFinished;
        const removeArchivedVaults =
          !showArchivedVaults && state === VaultState.Archived;

        if (removeActiveVaults) return false;

        if (removeLiveVaults) return false;

        if (removeFinishedVaults) return false;

        if (removeArchivedVaults) return false;

        if (showTradableVaults && !hasMarket) return false;

        if (showVerifiedVaults && !isVerified) return false;

        return nftsName.some((name) => name.includes(searchString));
      })
      .sort((a, b) => {
        if (sortField === 'createdAt') {
          if (sortOrder === 'asc') return a.createdAt - b.createdAt;
          return b.createdAt - a.createdAt;
        }
        if (sortOrder === 'asc') return a[sortField].cmp(b[sortField]);
        return b[sortField].cmp(a[sortField]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchString,
    rawVaults,
    showActiveVaults,
    showAuctionLiveVaults,
    showAuctionFinishedVaults,
    showArchivedVaults,
    showVerifiedVaults,
    showTradableVaults,
    sort,
  ]);

  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <div className={styles.filtersWrapper}>
          <div className={styles.filters}>
            <ControlledToggle
              control={control}
              name="showActiveVaults"
              label="Active"
              className={styles.filter}
            />
            <ControlledToggle
              control={control}
              name="showAuctionLiveVaults"
              label="Auction live"
              className={styles.filter}
            />
            <ControlledToggle
              control={control}
              name="showAuctionFinishedVaults"
              label="Auction finished"
              className={styles.filter}
            />
            <ControlledToggle
              control={control}
              name="showArchivedVaults"
              label="Archived"
              className={styles.filter}
            />
            <ControlledToggle
              control={control}
              name="showVerifiedVaults"
              label="Verified"
              className={styles.filter}
            />
            <ControlledToggle
              control={control}
              name="showTradableVaults"
              label="Tradable"
              className={styles.filter}
            />
          </div>
        </div>
        <div className={styles.wrapper}>
          <Sidebar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
          <div className={styles.contentWrapper}>
            <h2 className={styles.title}>
              Create, buy and sell fraktions of NFTs
            </h2>
            <div className={styles.searchSortWrapper}>
              <p className={styles.searchWrapper}>
                <SearchInput
                  onChange={(e) => searchItems(e.target.value || '')}
                  className={styles.search}
                  placeholder="Search by curator, collection or asset"
                />
              </p>
              <p
                className={styles.filtersIconWrapper}
                onClick={() => setIsSidebar(true)}
              >
                Filters
                <FiltersIcon />
              </p>
              <p className={styles.vaultsAmount}>{325} Vaults</p>
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
            {vaults.length && (
              <VaultsSlider
                className={styles.sliderFeatured}
                vaults={vaults}
                title={'Featured vaults'}
                isLoading={loading}
              />
            )}
            <VaultsList vaults={vaults} isLoading={loading} />
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
