import { FC, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useFraktion } from '../../contexts/fraktion';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import CollectionCard from '../../components/CollectionCard';
import { URLS } from '../../constants/urls';
import { fetchCollectionData } from '../../utils/getCollectionsData';
import styles from './styles.module.scss';
import { mapVaultByCollectionName } from './helpers';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import { SearchInput } from '../../components/SearchInput';
import { useDebounce } from '../../hooks';
import { ControlledSelect } from '../../components/Select/Select';
import ArrowDownSmallIcon from '../../icons/arrowDownSmall';
import {
  CollectionData,
  PromiseFulfilledResult,
} from '../../utils/getCollectionsData/collections.model';

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
  {
    label: (
      <span>
        Vault <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'vault_desc',
  },
  {
    label: (
      <span>
        Vault <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'vault_asc',
  },
];

const CollectionsPage: FC = () => {
  const { control, watch } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });

  const [searchString, setSearchString] = useState<string>('');
  const [collectionItems, setCollectionItems] = useState<CollectionData[]>([]);
  const { itemsToShow, next } = useFakeInfinityScroll(9);
  const { vaults, loading } = useFraktion();
  const sort = watch('sort');

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultByCollectionName(vaults);
  }, [loading, vaults]);

  const filteredCollection = useMemo(() => {
    const [sortField, sortOrder] = sort.value.split('_');

    return collectionItems
      .filter(({ collectionName }) => {
        return collectionName.toUpperCase().includes(searchString);
      })
      .sort((a, b) => {
        if (sortField === 'collectionName') {
          if (sortOrder === 'desc') {
            return a.collectionName.localeCompare(b.collectionName);
          }
          return b.collectionName.localeCompare(a.collectionName);
        }
        if (sortField === 'vault') {
          if (sortOrder === 'desc') {
            return String(
              vaultsByCollectionName[a.collectionName].length,
            ).localeCompare(
              String(vaultsByCollectionName[b.collectionName].length),
            );
          }
          return String(
            vaultsByCollectionName[b.collectionName].length,
          ).localeCompare(
            String(vaultsByCollectionName[a.collectionName].length),
          );
        }
      });
  }, [collectionItems, searchString, vaultsByCollectionName, sort]);

  useEffect(() => {
    getCollectionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const getCollectionItems = async (): Promise<void> => {
    const collectionNameKeys = Object.keys(vaultsByCollectionName);

    const responses = await Promise.allSettled(
      collectionNameKeys.map((response) => fetchCollectionData(response)),
    );

    const fulfilled = responses
      .filter(
        ({ value, status }: PromiseFulfilledResult) =>
          status === 'fulfilled' && value !== undefined,
      )
      .map((res: PromiseFulfilledResult) => res.value);

    setCollectionItems(fulfilled as CollectionData[]);
  };

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <SearchInput
          size="large"
          onChange={(e) => searchItems(e.target.value || '')}
          className={styles.search}
          placeholder="Search by collection name"
        />
        <div className={styles.filtersWrapper}>
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
          isLoading={!collectionItems.length}
          wrapperClassName={styles.cards}
          emptyMessage={'No collections found'}
        >
          {filteredCollection.map(({ collectionName, bannerPath }, id) => (
            <NavLink key={id} to={`${URLS.COLLECTION}/${collectionName}`}>
              <CollectionCard
                key={id}
                collectionName={collectionName}
                thumbnailPath={bannerPath}
                vaultCount={vaultsByCollectionName[collectionName].length}
              />
            </NavLink>
          ))}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default CollectionsPage;
