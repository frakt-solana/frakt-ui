import { useMemo, useState } from 'react';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import { useDebounce } from '../../hooks';
import {
  useFraktion,
  useFraktionInitialFetch,
  useFraktionPolling,
  VaultState,
} from '../../contexts/fraktion';
import { Controller, useForm } from 'react-hook-form';
import ArrowDownSmallIcon from '../../icons/arrowDownSmall';
import { VaultsList } from '../../components/VaultsList';
import { Sidebar } from './components/Sidebar';
import { VaultsSlider } from './components/VaultsSlider';
import { FiltersIcon } from '../../icons';
import { useFeaturedVaultsPublicKeys } from './hooks';
import { InputControlsNames, SortValue, StatusRadioNames } from './model';
import { Loader } from '../../components/Loader';
import { Select } from '../../components/Select';

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

const VaultsPage = (): JSX.Element => {
  const { control, watch } = useForm({
    defaultValues: {
      [InputControlsNames.SHOW_VAULTS_STATUS]: StatusRadioNames.SHOW_ALL_VAULTS,
      [InputControlsNames.SHOW_VERIFIED_VAULTS]: true,
      [InputControlsNames.SHOW_TRADABLE_VAULTS]: false,
      [InputControlsNames.SORT]: SORT_VALUES[0],
    },
  });

  const showVaultsStatus = watch(InputControlsNames.SHOW_VAULTS_STATUS);
  const showVerifiedVaults = watch(InputControlsNames.SHOW_VERIFIED_VAULTS);
  const showTradableVaults = watch(InputControlsNames.SHOW_TRADABLE_VAULTS);
  const sort = watch(InputControlsNames.SORT);

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
        //? Filter out unfinished vaults
        if (state === VaultState.Inactive) return false;

        const nftsNames =
          safetyBoxes?.map((nft) => nft.nftName.toUpperCase()) || [];

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

        return nftsNames.some((name) => name.includes(searchString));
      })
      .sort((vaultA, vaultB) => {
        if (sortField === 'createdAt') {
          if (sortOrder === 'asc') return vaultA.createdAt - vaultB.createdAt;
          return vaultB.createdAt - vaultA.createdAt;
        } else {
          if (sortOrder === 'asc')
            return vaultA[sortField].cmp(vaultB[sortField]);
          return vaultB[sortField].cmp(vaultA[sortField]);
        }
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
    if (
      featuredVaultsPublicKeys.length &&
      showVaultsStatus === StatusRadioNames.SHOW_ALL_VAULTS &&
      !searchString
    ) {
      return vaults.filter((vault) =>
        featuredVaultsPublicKeys.some((key) => key === vault.vaultPubkey),
      );
    }
    return [];
  }, [vaults, featuredVaultsPublicKeys, showVaultsStatus, searchString]);

  const liveAuctionVaults = useMemo(() => {
    if (
      vaults.length &&
      showVaultsStatus === StatusRadioNames.SHOW_ALL_VAULTS &&
      !searchString
    ) {
      return vaults.filter(({ state }) => state === VaultState.AuctionLive);
    }
    return [];
  }, [vaults, showVaultsStatus, searchString]);

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
            <h2 className={styles.title}>Vaults</h2>
            <p className={styles.subtitle}>
              Create, buy and sell fraktions of NFTs
            </p>
            <div className={styles.searchSortWrapper}>
              <p className={styles.searchWrapper}>
                <SearchInput
                  onChange={(event) => searchItems(event.target.value || '')}
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
              <div className={styles.sortWrapper}>
                <Controller
                  control={control}
                  name="sort"
                  render={({ field: { ref, ...field } }) => (
                    <Select
                      className={styles.sortingSelect}
                      valueContainerClassName={
                        styles.sortingSelectValueContainer
                      }
                      label="Sort by"
                      name="sort"
                      options={SORT_VALUES}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            {!!featuredVaults.length && (
              <VaultsSlider
                className={styles.sliderFeatured}
                vaults={featuredVaults}
                title="Featured vaults"
                isLoading={loading}
              />
            )}
            {!!liveAuctionVaults.length && (
              <VaultsSlider
                className={styles.sliderFeatured}
                vaults={liveAuctionVaults}
                title="Live auctions"
                isLoading={loading}
                isAuction
              />
            )}
            {!loading ? (
              <VaultsList vaults={vaults} isLoading={loading} />
            ) : (
              <Loader size="large" />
            )}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
