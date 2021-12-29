import { useEffect, useState } from 'react';
import { CollectionData } from './collections.model';
import { fetchCollectionData } from './index';

export const useCollectionsItem = (
  collectionName: string,
): {
  collectionsItem: CollectionData;
  initCollectionItem: (collectionName: string) => Promise<void>;
} => {
  const [collectionsItem, setCollectionsItem] = useState<CollectionData>({});

  useEffect(() => {
    initCollectionItem(collectionName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initCollectionItem = async (collectionName: string): Promise<void> => {
    try {
      const data = await fetchCollectionData(collectionName);

      setCollectionsItem(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return { collectionsItem, initCollectionItem };
};
