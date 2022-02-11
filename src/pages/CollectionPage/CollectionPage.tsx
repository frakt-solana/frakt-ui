import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useWallet } from '@solana/wallet-adapter-react';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { ArrowDownSmallIcon } from '../../icons';
import { useFraktion, VaultState } from '../../contexts/fraktion';
import { useDebounce } from '../../hooks';
import { SearchInput } from '../../components/SearchInput';
import { ControlledSelect } from '../../components/Select/Select';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { mapVaultsByCollectionName } from '../../utils/collections';
import { VaultsList } from '../../components/VaultsList';
import { CollectionBanner } from './CollectionBanner';
import styles from './styles.module.scss';

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
      showActiveVaults: true,
      showAuctionLiveVaults: true,
      showAuctionFinishedVaults: true,
      showArchivedVaults: false,
      showMyVaults: false,
      showTradableVaults: false,
      sort: SORT_VALUES[0],
    },
  });

  const sort = watch('sort');
  const showActiveVaults = watch('showActiveVaults');
  const showAuctionLiveVaults = watch('showAuctionLiveVaults');
  const showAuctionFinishedVaults = watch('showAuctionFinishedVaults');
  const showArchivedVaults = watch('showArchivedVaults');
  const showMyVaults = watch('showMyVaults');
  const showTradableVaults = watch('showTradableVaults');

  const { connected, publicKey } = useWallet();
  const [searchString, setSearchString] = useState<string>('');
  const { collectionName } = useParams<{ collectionName: string }>();
  const { vaults, loading } = useFraktion();

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultsByCollectionName(vaults);
  }, [loading, vaults]);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const userVaults = useMemo(() => {
    const filteredVaults = vaultsByCollectionName[collectionName];
    const [sortField, sortOrder] = sort.value.split('_');

    if (filteredVaults) {
      return filteredVaults
        .filter(
          (
            { state, authority, hasMarket, safetyBoxes, vaultPubkey },
            index,
            self,
          ) => {
            const nftsName =
              safetyBoxes?.map((nft) => nft.nftName.toUpperCase()) || [];
            if (state === VaultState.Inactive) return false;

            if (connected && showMyVaults && authority !== publicKey.toString())
              return false;

            const removeActiveVaults =
              !showActiveVaults && state === VaultState.Active;
            const removeLiveVaults =
              !showAuctionLiveVaults && state === VaultState.AuctionLive;
            const removeFinishedVaults =
              !showAuctionFinishedVaults &&
              state === VaultState.AuctionFinished;
            const removeArchivedVaults =
              !showArchivedVaults && state === VaultState.Archived;

            if (removeActiveVaults) return false;

            if (removeLiveVaults) return false;

            if (removeFinishedVaults) return false;

            if (removeArchivedVaults) return false;

            if (showTradableVaults && !hasMarket) return false;

            if (
              index ===
              self.findIndex((vault) => vault.vaultPubkey === vaultPubkey)
            )
              return nftsName.some((name) => name.includes(searchString));
          },
        )
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
    showActiveVaults,
    showAuctionLiveVaults,
    showAuctionFinishedVaults,
    showArchivedVaults,
    showMyVaults,
    showTradableVaults,
    connected,
    publicKey,
  ]);

  return (
    <AppLayout>
      <CollectionBanner collectionName={collectionName} />
      <Container component="main" className={styles.container}>
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
              name="showTradableVaults"
              label="Tradable"
              className={styles.filter}
            />
            {connected && (
              <ControlledToggle
                control={control}
                name="showMyVaults"
                label="My Vaults"
                className={styles.filter}
              />
            )}
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
        <VaultsList vaults={userVaults || []} isLoading={loading} />
      </Container>
    </AppLayout>
  );
};

export default CollectionPage;
