import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';

import { useFraktion } from '../../contexts/fraktion';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import CollectionCard from '../../components/CollectionCard';
import { URLS } from '../../constants/urls';
import { queryCollectionsItem } from '../../utils/getCollectionsData';
import styles from './styles.module.scss';
import { mapVaultByCollectionName } from './helpers';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';

const CollectionsPage = (): JSX.Element => {
  const history = useHistory();
  const { vaults, loading } = useFraktion();
  const [collectionItems, setCollectionItems] = useState<any>([]);
  const { itemsToShow, next } = useFakeInfinityScroll(9);

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultByCollectionName(vaults);
  }, [loading, vaults]);

  useEffect(() => {
    getCollectionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onChangeCollection = (collectionName: string) => {
    if (!collectionName) {
      history.push(URLS.COLLECTIONS);
    } else {
      history.push(`${URLS.COLLECTION}/${collectionName}`);
    }
  };

  const getCollectionItems = async (): Promise<void> => {
    const collectionNameKeys = Object.keys(vaultsByCollectionName);

    const items = await Promise.allSettled(
      collectionNameKeys.map(async (item) => {
        const result = await queryCollectionsItem(item);
        return result;
      }),
    );
    setCollectionItems(items);
  };

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={loading}
          wrapperClassName={styles.cards}
          emptyMessage={'No collections found'}
        >
          {collectionItems.map(({ value }) => (
            <CollectionCard
              key={value?.states?.live.collectionId}
              collectionName={value?.states?.live.collectionName}
              thumbnailPath={value?.states?.live.thumbnailPath}
              onClick={() =>
                onChangeCollection(value?.states?.live.collectionName)
              }
            />
          ))}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default CollectionsPage;
