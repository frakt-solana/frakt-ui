import { FC, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import CollectionCard from '../../components/CollectionCard';
import { URLS } from '../../constants/urls';
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
import { useCollections } from '../../contexts/collections';

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
  const {
    collectionsData,
    vaultsNotArchivedByCollectionName,
    isCollectionsLoading,
  } = useCollections();

  const { itemsToShow, next } = useFakeInfinityScroll(9);
  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredCollection = useMemo(() => {
    const [sortField, sortOrder] = sort.value.split('_');

    return collectionsData
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
        },
      );
  }, [collectionsData, searchString, vaultsNotArchivedByCollectionName, sort]);

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
          isLoading={isCollectionsLoading}
          wrapperClassName={styles.cards}
          emptyMessage={'No collections found'}
        >
          {filteredCollection.map(
            ({ collectionName, bannerPath }, idx) =>
              vaultsNotArchivedByCollectionName[collectionName] && (
                <NavLink key={idx} to={`${URLS.COLLECTION}/${collectionName}`}>
                  <CollectionCard
                    key={idx}
                    collectionName={collectionName}
                    thumbnailPath={bannerPath}
                    vaultsByCollectionName={
                      vaultsNotArchivedByCollectionName[collectionName]
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
