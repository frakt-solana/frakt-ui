import React, { useMemo, useState } from 'react';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import { useDebounce } from '../../hooks';
import {
  VaultState,
  useFraktion,
  useFraktionInitialFetch,
  useFraktionPolling,
} from '../../contexts/fraktion';
import { useForm } from 'react-hook-form';
import { ControlledSelect } from '../../components/Select/Select';
import ArrowDownSmallIcon from '../../icons/arrowDownSmall';
import { VaultsList } from '../../components/VaultsList';
import { Sidebar } from './components/Sidebar';
import { VaultsSlider } from './components/VaultsSlider';
import { FiltersIcon } from '../../icons';
import { useFeaturedVaultsPublicKeys } from './hooks';

export type SortValue = {
  label: JSX.Element;
  value: string;
};

const SORT_VALUES: SortValue[] = [
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

export enum SidebarCheckboxNames {
  SHOW_VERIFIED_VAULTS = 'showVerifiedVaults',
  SHOW_TRADABLE_VAULTS = 'showTradableVaults',
}

export enum StatusRadioNames {
  SHOW_ACTIVE_VAULTS = 'showActiveVaults',
  SHOW_AUCTION_LIVE_VAULTS = 'showAuctionLiveVaults',
  SHOW_AUCTION_FINISHED_VAULTS = 'showAuctionFinishedVaults',
  SHOW_ARCHIVED_VAULTS = 'showArchivedVaults',
}

export enum InputControlsNames {
  SHOW_VAULTS_STATUS = 'showVaultsStatus',
  SHOW_VERIFIED_VAULTS = 'showVerifiedVaults',
  SHOW_TRADABLE_VAULTS = 'showTradableVaults',
  SORT = 'sort',
}

export type FormFieldValues = {
  [InputControlsNames.SHOW_VAULTS_STATUS]: StatusRadioNames;
  [InputControlsNames.SHOW_VERIFIED_VAULTS]: boolean;
  [InputControlsNames.SHOW_TRADABLE_VAULTS]: boolean;
  [InputControlsNames.SORT]: SortValue;
};

const VaultsPage = (): JSX.Element => {
  const { control, watch } = useForm({
    defaultValues: {
      [InputControlsNames.SHOW_VAULTS_STATUS]:
        StatusRadioNames.SHOW_ACTIVE_VAULTS,
      [InputControlsNames.SHOW_VERIFIED_VAULTS]: true,
      [InputControlsNames.SHOW_TRADABLE_VAULTS]: false,
      sort: SORT_VALUES[0],
    },
  });

  const showVaultsStatus = watch('showVaultsStatus');
  const showVerifiedVaults = watch('showVerifiedVaults');
  const showTradableVaults = watch('showTradableVaults');
  const sort = watch('sort');
  const [isSidebar, setIsSidebar] = useState<boolean>(false);

  const { loading, vaults: rawVaults } = useFraktion();
  useFraktionInitialFetch();
  useFraktionPolling();

  const [searchString, setSearchString] = useState<string>('');

  const { featuredVaultsPublicKeys } = useFeaturedVaultsPublicKeys();

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaults = useMemo(() => {
    const [sortField, sortOrder] = sort.value.split('_');
    return rawVaults
      .filter(({ state, hasMarket, safetyBoxes, isVerified }) => {
        const nftsName =
          safetyBoxes?.map((nft) => nft.nftName.toUpperCase()) || [];

        const showActiveVaults =
          showVaultsStatus === StatusRadioNames.SHOW_ACTIVE_VAULTS;
        const showAuctionLiveVaults =
          showVaultsStatus === StatusRadioNames.SHOW_AUCTION_LIVE_VAULTS;
        const showAuctionFinishedVaults =
          showVaultsStatus === StatusRadioNames.SHOW_AUCTION_FINISHED_VAULTS;
        const showArchivedVaults =
          showVaultsStatus === StatusRadioNames.SHOW_ARCHIVED_VAULTS;

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
    showVaultsStatus,
    showVerifiedVaults,
    showTradableVaults,
    sort,
  ]);

  const featuredVaults = useMemo(() => {
    if (rawVaults.length && featuredVaultsPublicKeys.length) {
      return rawVaults.filter((vault) =>
        featuredVaultsPublicKeys.some((key) => key === vault.vaultPubkey),
      );
    }
    return [];
  }, [rawVaults, featuredVaultsPublicKeys]);

  const liveAuctionVaults = useMemo(() => {
    if (vaults.length) {
      return rawVaults.filter(({ state }) => state === VaultState.AuctionLive);
    }
    return [];
  }, [rawVaults, vaults.length]);

  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <div className={styles.wrapper}>
          <Sidebar
            isSidebar={isSidebar}
            control={control}
            setIsSidebar={setIsSidebar}
          />
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
              <p className={styles.vaultsAmount}>{vaults.length} Vaults</p>
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
            {!!featuredVaults.length && (
              <VaultsSlider
                className={styles.sliderFeatured}
                vaults={featuredVaults}
                title={'Featured vaults'}
                isLoading={loading}
              />
            )}
            {!!liveAuctionVaults.length && (
              <VaultsSlider
                className={styles.sliderFeatured}
                vaults={liveAuctionVaults}
                title={'Live auction'}
                isLoading={loading}
                isAuction
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
