import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { ArrowDownSmallIcon, FiltersIcon } from '../../icons';
import {
  useFraktion,
  useFraktionInitialFetch,
  VaultState,
} from '../../contexts/fraktion';
import { useDebounce } from '../../hooks';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select/Select';
import { mapVaultsByCollectionName } from '../../utils/collections';
import { VaultsList } from '../../components/VaultsList';
import { CollectionBanner } from './CollectionBanner';
import styles from './styles.module.scss';
import { Sidebar } from '../VaultsPage/components/Sidebar';
import { InputControlsNames, StatusRadioNames } from '../VaultsPage/model';
import { useCachedCollections } from '../CollectionsPage';

const SORT_VALUES = [
  {
    label: (
      <span>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'collectionName_asc',
  },
  {
    label: (
      <span>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'collectionName_desc',
  },
];

const CollectionPage: FC = () => {
  const { control, watch } = useForm({
    defaultValues: {
      [InputControlsNames.SHOW_VAULTS_STATUS]:
        StatusRadioNames.SHOW_ACTIVE_VAULTS,
      [InputControlsNames.SHOW_VERIFIED_VAULTS]: false,
      [InputControlsNames.SHOW_TRADABLE_VAULTS]: false,
      [InputControlsNames.SORT]: SORT_VALUES[0],
    },
  });

  const showVaultsStatus = watch(InputControlsNames.SHOW_VAULTS_STATUS);
  const showVerifiedVaults = watch(InputControlsNames.SHOW_VERIFIED_VAULTS);
  const showTradableVaults = watch(InputControlsNames.SHOW_TRADABLE_VAULTS);
  const sort = watch(InputControlsNames.SORT);

  const [searchString, setSearchString] = useState<string>('');
  const [isSidebar, setIsSidebar] = useState<boolean>(false);
  const { collectionName } = useParams<{ collectionName: string }>();
  const { collections } = useCachedCollections();

  const { vaults, loading } = useFraktion();
  useFraktionInitialFetch();

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultsByCollectionName(vaults);
  }, [loading, vaults]);

  const currentCollection = collections.get(collectionName);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const userVaults = useMemo(() => {
    const filteredVaults = vaultsByCollectionName[collectionName];
    const [sortField, sortOrder] = sort.value.split('_');

    if (filteredVaults) {
      return filteredVaults
        .filter(({ state, hasMarket, safetyBoxes, isVerified }) => {
          const nftsName =
            safetyBoxes?.map((nft) => nft.nftName.toUpperCase()) || [];
          if (state === VaultState.Inactive) return false;

          const showAllVaults =
            showVaultsStatus === StatusRadioNames.SHOW_ALL_VAULTS;
          const showActiveVaults =
            showVaultsStatus === StatusRadioNames.SHOW_ACTIVE_VAULTS;
          const showAuctionLiveVaults =
            showVaultsStatus === StatusRadioNames.SHOW_AUCTION_LIVE_VAULTS;
          const showAuctionFinishedVaults =
            showVaultsStatus === StatusRadioNames.SHOW_AUCTION_FINISHED_VAULTS;
          const showArchivedVaults =
            showVaultsStatus === StatusRadioNames.SHOW_ARCHIVED_VAULTS;

          const removeBecauseActive =
            !showActiveVaults && state === VaultState.Active && !showAllVaults;
          const removeBecauseLive =
            !showAuctionLiveVaults &&
            state === VaultState.AuctionLive &&
            !showAllVaults;
          const removeBecauseFinished =
            !showAuctionFinishedVaults &&
            state === VaultState.AuctionFinished &&
            !showAllVaults;
          const removeBecauseArchived =
            !showArchivedVaults &&
            state === VaultState.Archived &&
            !showAllVaults;

          if (
            removeBecauseActive ||
            removeBecauseLive ||
            removeBecauseFinished ||
            removeBecauseArchived
          )
            return false;

          if (showTradableVaults && !hasMarket) return false;

          if (showVerifiedVaults && !isVerified) return false;

          return nftsName.some((name) => name.includes(searchString));
        })
        .sort((a, b) => {
          if (sortField === 'collectionName') {
            if (sortOrder === 'desc') {
              return a.safetyBoxes[0].nftName.localeCompare(
                b.safetyBoxes[0].nftName,
              );
            }
            return b.safetyBoxes[0].nftName.localeCompare(
              a.safetyBoxes[0].nftName,
            );
          }
        });
    }
  }, [
    collectionName,
    vaultsByCollectionName,
    sort,
    searchString,
    showTradableVaults,
    showVerifiedVaults,
    showVaultsStatus,
  ]);

  return (
    <AppLayout>
      {currentCollection && (
        <CollectionBanner currentCollection={currentCollection} />
      )}
      <Container component="main" className={styles.wrapper}>
        <Sidebar
          isSidebar={isSidebar}
          control={control}
          setIsSidebar={setIsSidebar}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.searchSortWrapper}>
            <p className={styles.searchWrapper}>
              <SearchInput
                onChange={(e) => searchItems(e.target.value || '')}
                className={styles.search}
                placeholder="Search by vault name"
              />
            </p>
            <p
              className={styles.filtersIconWrapper}
              onClick={() => setIsSidebar(true)}
            >
              Filters
              <FiltersIcon />
            </p>
            <div className={styles.sortWrapper}>
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
          <VaultsList vaults={userVaults || []} isLoading={loading} />
        </div>
      </Container>
    </AppLayout>
  );
};

export default CollectionPage;
