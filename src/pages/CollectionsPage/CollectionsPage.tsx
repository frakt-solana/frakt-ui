import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

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
import { PromiseFulfilledResult } from '../../utils/getCollectionsData/collections.model';

const CollectionsPage = (): JSX.Element => {
  const { vaults, loading } = useFraktion();
  const [collectionItems, setCollectionItems] = useState([]);
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultByCollectionName(vaults);
  }, [loading, vaults]);

  useEffect(() => {
    getCollectionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const getCollectionItems = async (): Promise<void> => {
    const collectionNameKeys = Object.keys(vaultsByCollectionName);

    const responses = await Promise.allSettled(
      collectionNameKeys.map((response) => fetchCollectionData(response)),
    );

    const responsesSuccess = responses.filter(
      ({ value, status }: PromiseFulfilledResult) => {
        return status === 'fulfilled' && value !== undefined;
      },
    );

    setCollectionItems(responsesSuccess);
  };

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={!collectionItems.length}
          wrapperClassName={styles.cards}
          emptyMessage={'No collections found'}
        >
          {collectionItems.map(({ value }, id) => (
            <NavLink
              key={id}
              to={`${URLS.COLLECTION}/${value?.collectionName}`}
            >
              <CollectionCard
                key={id}
                collectionName={value?.collectionName}
                thumbnailPath={value?.thumbnailPath}
              />
            </NavLink>
          ))}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default CollectionsPage;
