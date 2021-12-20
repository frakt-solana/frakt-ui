import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import CollectionCard from '../../components/CollectionCard';
import useCollections from '../../utils/getCollectionsData/useCollections';
import styles from './styles.module.scss';
import { URLS } from '../../constants/urls';
import { queryCollectionsItem } from '../../utils/getCollectionsData';

const CollectionsPage = (): JSX.Element => {
  const history = useHistory();
  const { collections } = useCollections();
  const [currentCollection, setCurrentCollection] = useState<string>('');
  const [collectionWithBanner, setCollectionWithBanner] =
    useState<any>(collections);

  useEffect(() => {
    onChangeCollection(currentCollection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCollection]);

  const onChangeCollection = (collectionName: string) => {
    if (!collectionName) {
      history.push(URLS.COLLECTIONS);
    } else {
      history.push(`${URLS.COLLECTION}/${collectionName}`);
    }
  };

  useEffect(() => {
    getBannerCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

  const getBannerCollection = async () => {
    const bannerCollection = await Promise.allSettled(
      collections.map(async (item) => {
        const result = await queryCollectionsItem(item.collectionName);
        if (result) {
          return { ...item, thumbnailPath: result.states.live.thumbnailPath };
        } else {
          // eslint-disable-next-line no-console
          console.log('error');
        }
      }),
    );
    setCollectionWithBanner(bannerCollection);
  };

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <div className={styles.content}>
          {collectionWithBanner.map(({ value }) => (
            <CollectionCard
              key={value?.collectionId}
              collectionName={value?.collectionName}
              thumbnailPath={value?.thumbnailPath}
              onClick={() => setCurrentCollection(value?.collectionName)}
            />
          ))}
        </div>
      </Container>
    </AppLayout>
  );
};

export default CollectionsPage;
