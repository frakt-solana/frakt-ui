import { FC, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import CollectionCard from '../../components/CollectionCard';
import { PATHS } from '../../constants';
import {
  compareVaultsArraysByNFTsAmount,
  compareVaultsArraysBySize,
} from '../../utils/collections';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import ArrowDownSmallIcon from '../../icons/arrowDownSmall';
import { CollectionsFilter } from './CollectionsFilter';
import { useFraktionInitialFetch } from '../../contexts/fraktion';
import { useCachedCollections } from './useCachedCollections';

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

  useFraktionInitialFetch();

  const {
    collections,
    loading: isCollectionsLoading,
    vaultsNotArchivedByCollectionName,
  } = useCachedCollections();

  const collectionsData = Array.from(collections.values());

  const { itemsToShow, next } = useFakeInfinityScroll(9);
  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredCollection = useMemo(() => {
    const [sortField, sortOrder] = sort.value.split('_');

    return collectionsData
      .filter(({ symbol }) => symbol.toUpperCase().includes(searchString))
      .sort(({ symbol: collectionNameA }, { symbol: collectionNameB }) => {
        if (sortField === 'collectionName') {
          if (sortOrder === 'desc') {
            return collectionNameA.localeCompare(collectionNameB);
          }
          return collectionNameB.localeCompare(collectionNameA);
        }
        if (sortField === 'vault') {
          return compareVaultsArraysBySize(
            vaultsNotArchivedByCollectionName[collectionNameA],
            vaultsNotArchivedByCollectionName[collectionNameB],
            sortOrder === 'desc',
          );
        }
        if (sortField === 'nfts') {
          return compareVaultsArraysByNFTsAmount(
            vaultsNotArchivedByCollectionName[collectionNameA],
            vaultsNotArchivedByCollectionName[collectionNameB],
            sortOrder === 'desc',
          );
        }
        return 0;
      });
  }, [collectionsData, searchString, vaultsNotArchivedByCollectionName, sort]);

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Collections</h1>
        <CollectionsFilter
          searchItems={searchItems}
          sortVaules={SORT_VALUES}
          sortControl={control}
        />
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={isCollectionsLoading}
          wrapperClassName={styles.cards}
          emptyMessage={'No collections found'}
        >
          {filteredCollection.map(
            ({ name: collectionName, symbol, image }, idx) =>
              vaultsNotArchivedByCollectionName[symbol] && (
                <NavLink key={idx} to={`${PATHS.COLLECTION}/${symbol}`}>
                  <CollectionCard
                    key={idx}
                    collectionName={collectionName}
                    collectionSymbol={symbol}
                    collectionImage={image}
                    vaultsByCollectionName={
                      vaultsNotArchivedByCollectionName[symbol]
                    }
                  />
                </NavLink>
              ),
          )}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default CollectionsPage;
