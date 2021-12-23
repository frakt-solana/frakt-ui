import { useState, useMemo } from 'react';

import VaultCard from '../../components/VaultCard';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';
import { SearchInput } from '../../components/SearchInput';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import { VaultState, useFraktion } from '../../contexts/fraktion';
import { NavLink } from 'react-router-dom';
import { URLS } from '../../constants';
import { useForm } from 'react-hook-form';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { ControlledSelect } from '../../components/Select/Select';
import ArrowDownSmallIcon from '../../icons/arrowDownSmall';

const SORT_VALUES = [
  {
    label: (
      <span>
        Date created <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'createdAt_asc',
  },
  {
    label: (
      <span>
        Date created <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'createdAt_desc',
  },
  {
    label: (
      <span>
        Supply <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'fractionsSupply_asc',
  },
  {
    label: (
      <span>
        Supply <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'fractionsSupply_desc',
  },
  // {
  //   label: (
  //     <span>
  //       Buyout price <ArrowDownSmallIcon className={styles.arrowUp} />
  //     </span>
  //   ),
  //   value: 'buyoutPrice_asc',
  // },
  // {
  //   label: (
  //     <span>
  //       Buyout price <ArrowDownSmallIcon className={styles.arrowDown} />
  //     </span>
  //   ),
  //   value: 'buyoutPrice_desc',
  // },
  // {
  //   label: (
  //     <span>
  //       Fraction price <ArrowDownSmallIcon className={styles.arrowUp} />
  //     </span>
  //   ),
  //   value: 'lockedPricePerFraction_asc',
  // },
  // {
  //   label: (
  //     <span>
  //       Fraction price <ArrowDownSmallIcon className={styles.arrowDown} />
  //     </span>
  //   ),
  //   value: 'lockedPricePerFraction_desc',
  // },
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

  const { loading, vaults: rawVaults } = useFraktion();
  const [searchString, setSearchString] = useState<string>('');
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaults = useMemo(() => {
    const [sortField, sortOrder] = sort.value.split('_');
    return rawVaults
      .filter(({ state, hasMarket, safetyBoxes }) => {
        //TODO: finish for baskets
        const { nftName, isNftVerified } =
          safetyBoxes.length === 1
            ? safetyBoxes[0]
            : {
                nftName: '',
                isNftVerified: false,
              };

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

        if (showVerifiedVaults && !isNftVerified) return false;

        return nftName.toUpperCase().includes(searchString);
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
        <SearchInput
          size="large"
          onChange={(e) => searchItems(e.target.value || '')}
          className={styles.search}
          placeholder="Search by vault name"
        />
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
          <div>
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

        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={loading}
          wrapperClassName={styles.cards}
          emptyMessage={'No vaults found'}
        >
          {vaults.map((vault) => (
            <NavLink
              key={vault.vaultPubkey}
              to={`${URLS.VAULT}/${vault.vaultPubkey}`}
            >
              <VaultCard vaultData={vault} />
            </NavLink>
          ))}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default VaultsPage;
