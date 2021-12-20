import { useEffect, useState } from 'react';
import { CollectionData } from './collection.model';
import { queryCollectionsItem } from './index';

interface CollectionsProps {
  collectionsItem: CollectionData[];
  initCollectionItem: (collectionName: string) => Promise<void>;
}

const useCollectionsItem = (collectionName: string): CollectionsProps => {
  const [collectionsItem, setCollectionsItem] = useState<Array<CollectionData>>(
    [],
  );

  useEffect(() => {
    initCollectionItem(collectionName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initCollectionItem = async (collectionName: string): Promise<void> => {
    try {
      const data = await queryCollectionsItem(collectionName);

      setCollectionsItem(data.states.live);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return { collectionsItem, initCollectionItem };
};

export default useCollectionsItem;
