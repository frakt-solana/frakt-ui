import { FC, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useWallet } from '@solana/wallet-adapter-react';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { ArrowDownSmallIcon, DiscordIcon, TwitterIcon } from '../../icons';
import { CollectionData } from '../../utils/collections/collections.model';
import { useFraktion, VaultState } from '../../contexts/fraktion';
import styles from './styles.module.scss';
import { getCollectionThumbnailUrl } from '../../utils';
import { useCollectionsItem } from '../../utils/collections/collections.hooks';
import { WebsiteIcon } from '../../icons/WebsiteIcon';
import { useDebounce } from '../../hooks';
import { SearchInput } from '../../components/SearchInput';
import { ControlledSelect } from '../../components/Select/Select';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { mapVaultsByCollectionName } from '../../utils/collections';
import { VaultsList } from '../../components/VaultsList';

const SORT_VALUES = [
  {
    label: (
      <span>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'collectionName_desc',
  },
  {
    label: (
      <span>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'collectionName_asc',
  },
];

const CollectionPage: FC = () => {
  const { control, watch } = useForm({
    defaultValues: {
      showActiveVaults: true,
      showAuctionLiveVaults: false,
      showAuctionFinishedVaults: false,
      showArchivedVaults: true,
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
  const history = useHistory();
  const [searchString, setSearchString] = useState<string>('');
  const queryId = history.location.pathname.replace('/collection/', '');
  const { collectionsItem } = useCollectionsItem(queryId);
  const { vaults, loading } = useFraktion();

  const {
    bannerPath,
    collectionName,
    website,
    discord,
    twitter,
    thumbnailPath,
  } = collectionsItem as CollectionData;

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultsByCollectionName(vaults);
  }, [loading, vaults]);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const userVaults = useMemo(() => {
    const filteredVaults = vaultsByCollectionName[queryId];
    const [sortField, sortOrder] = sort.value.split('_');

    if (filteredVaults) {
      return filteredVaults
        .filter(({ state, authority, hasMarket, safetyBoxes }) => {
          const { nftName } = safetyBoxes[0];
          if (state === VaultState.Inactive) return false;

          if (connected && showMyVaults && authority !== publicKey.toString())
            return false;

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

          return nftName.toUpperCase().includes(searchString);
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
    queryId,
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
      <div className={styles.fullPage}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${getCollectionThumbnailUrl(bannerPath)})`,
          }}
        />
      </div>
      <Container component="main" className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.thumbnail}>
            <img src={getCollectionThumbnailUrl(thumbnailPath)} />
          </div>
          <div className={styles.title}>{collectionName}</div>
          <div className={styles.socialLinks}>
            <a href={website} target="_bank" rel="noopener noreferrer">
              <WebsiteIcon width={46} alt="website" />
            </a>
            <a href={discord} target="_bank" rel="noopener noreferrer">
              <DiscordIcon width={48} alt="discord" />
            </a>
            <a href={twitter} target="_bank" rel="noopener noreferrer">
              <TwitterIcon width={48} alt="twitter" />
            </a>
          </div>
        </div>
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
