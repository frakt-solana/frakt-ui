import { FC, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useFraktion, VaultState } from '../../contexts/fraktion';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import CollectionCard from '../../components/CollectionCard';
import { URLS } from '../../constants/urls';
import {
  CollectionData,
  mapVaultsByCollectionName,
  compareVaultsArraysBySize,
  compareVaultsArraysByNFTsAmount,
  fetchCollectionsData,
} from '../../utils/collections';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import ArrowDownSmallIcon from '../../icons/arrowDownSmall';
import { CollectionsFilter } from './CollectionsFilter';

const SORT_VALUES = [
  {
    label: (
      <span>
        Vaults amount <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'vault_desc',
  },
  {
    label: (
      <span>
        Vaults amount <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'vault_asc',
  },
  {
    label: (
      <span>
        NTFs amount <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'nfts_desc',
  },
  {
    label: (
      <span>
        NTFs amount <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'nfts_asc',
  },
];

const CollectionsPage: FC = () => {
  const { control, watch } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });
  const sort = watch('sort');

  const [searchString, setSearchString] = useState<string>('');
  const [сollectionsData, setCollectionsData] = useState<CollectionData[]>([]);

  const { vaults, loading } = useFraktion();
  const { itemsToShow, next } = useFakeInfinityScroll(9);
  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultsByCollectionName(vaults);
  }, [loading, vaults]);
  console.log(vaultsByCollectionName);

  const filteredCollection = useMemo(() => {
    const [sortField, sortOrder] = sort.value.split('_');

    return сollectionsData
      .filter(({ collectionName }) =>
        collectionName.toUpperCase().includes(searchString),
      )
      .sort(
        (
          { collectionName: collectionNameA },
          { collectionName: collectionNameB },
        ) => {
          if (sortField === 'vault') {
            return compareVaultsArraysBySize(
              vaultsByCollectionName[collectionNameA],
              vaultsByCollectionName[collectionNameB],
              sortOrder === 'desc',
            );
          }
          if (sortField === 'nfts') {
            return compareVaultsArraysByNFTsAmount(
              vaultsByCollectionName[collectionNameA],
              vaultsByCollectionName[collectionNameB],
              sortOrder === 'desc',
            );
          }
          return 0;
        },
      );
  }, [сollectionsData, searchString, vaultsByCollectionName, sort]);

  const getCollectionItems = async (): Promise<void> => {
    const collectionsNames = Object.keys(vaultsByCollectionName);
    const collectionsData = await fetchCollectionsData(collectionsNames);
    setCollectionsData(collectionsData);
  };

  useEffect(() => {
    !loading && getCollectionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <CollectionsFilter
          searchItems={searchItems}
          sortVaules={SORT_VALUES}
          sortControl={control}
        />
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={!сollectionsData.length}
          wrapperClassName={styles.cards}
          emptyMessage={'No collections found'}
        >
          {filteredCollection.map(({ collectionName, bannerPath }, idx) => (
            <NavLink key={idx} to={`${URLS.COLLECTION}/${collectionName}`}>
              <CollectionCard
                key={idx}
                collectionName={collectionName}
                thumbnailPath={bannerPath}
                vaultCount={
                  vaultsByCollectionName[collectionName].filter(
                    (vault) => vault.state !== VaultState.Archived,
                  ).length
                }
              />
            </NavLink>
          ))}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default CollectionsPage;
