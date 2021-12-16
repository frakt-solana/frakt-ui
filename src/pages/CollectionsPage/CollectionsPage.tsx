import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import {
  queryCollections,
  queryCollectionsItem,
} from '../../utils/getCollectionsData';
import useCollectionsItem from './hooks/useCollectionsItem';
import useCollections from './hooks/useCollections';

import styles from './styles.module.scss';
import CollectionCard from '../../components/CollectionCard';

interface CollectionsProps {
  brandId: string;
  collectionId: string;
  collectionName: string;
}

const CollectionsPage = (): JSX.Element => {
  const history = useHistory();

  const { collections, initCollections } = useCollections(queryCollections);
  const { collectionsItem, initCollectionItem } = useCollectionsItem(
    queryCollectionsItem,
    '',
  );
  const [filteredCollection, setFilteredCollection] = useState<string[]>([]);

  const [collectionBrand, setCollectionBrand] = useState<string>('');

  useEffect(() => {
    initCollections();
  }, []);

  useEffect(() => {
    const filterCollection = collections.filter(
      (item) => item.brandId === collectionBrand,
    );
    setFilteredCollection(filterCollection);
  }, [collectionBrand]);

  const onChangeCollection = (id: string) => {
    if (!id) {
      history.push('/collections');
    } else {
      history.push(`/collection/${id}`);
    }
  };

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        {collections.map(
          ({ collectionName, collectionId, brandId }: CollectionsProps) => (
            <CollectionCard
              key={collectionId}
              brandId={brandId}
              collectionName={collectionName}
              collectionId={collectionId}
              onClick={() => setCollectionBrand(brandId)}
            />
          ),
        )}
      </Container>
    </AppLayout>
  );
};

export default CollectionsPage;
