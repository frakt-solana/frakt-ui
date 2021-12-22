import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import _ from 'lodash';

import { useFraktion } from '../../contexts/fraktion';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import CollectionCard from '../../components/CollectionCard';
import { URLS } from '../../constants/urls';
import { queryCollectionsItem } from '../../utils/getCollectionsData';
import styles from './styles.module.scss';

const CollectionsPage = (): JSX.Element => {
  const history = useHistory();
  const { vaults } = useFraktion();
  const [collectionItems, setCollectionItems] = useState<any>([]);

  const mapVaultByCollectionName = () => {
    return _.reduce(
      vaults,
      (result, value, key) => {
        const { safetyBoxes } = value;
        if (safetyBoxes.length) {
          (
            result[safetyBoxes[0].nftCollectionName] ||
            (result[safetyBoxes[0].nftCollectionName] = [])
          ).push(vaults[key]);
        }
        return result;
      },
      [],
    );
  };

  useEffect(() => {
    getCollectionItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionItems]);

  const onChangeCollection = (collectionName: string) => {
    if (!collectionName) {
      history.push(URLS.COLLECTIONS);
    } else {
      history.push(`${URLS.COLLECTION}/${collectionName}`);
    }
  };

  const getCollectionItems = async (): Promise<void> => {
    const vaultCollectionArray = await mapVaultByCollectionName();
    const collectionNameKeys = Object.keys(vaultCollectionArray);

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
        <div className={styles.content}>
          {collectionItems.map(({ value }) => (
            <CollectionCard
              key={value?.states.live.collectionId}
              collectionName={value?.states.live.collectionName}
              thumbnailPath={value?.states.live.thumbnailPath}
              onClick={() =>
                onChangeCollection(value?.states.live.collectionName)
              }
            />
          ))}
        </div>
      </Container>
    </AppLayout>
  );
};

export default CollectionsPage;
