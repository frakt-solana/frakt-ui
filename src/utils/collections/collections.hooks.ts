import { useEffect, useState } from 'react';
import { CollectionData } from './collections.model';
import { fetchCollectionData } from './index';

export const useCollectionData = (
  collectionName: string,
): {
  collectionsItem: CollectionData;
  refetch: (collectionName: string) => Promise<void>;
} => {
  const [collectionData, setCollectionData] = useState<CollectionData>({});

  useEffect(() => {
    fetchData(collectionName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (collectionName: string): Promise<void> => {
    try {
      const data = await fetchCollectionData(collectionName);

      setCollectionData(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return { collectionsItem: collectionData, refetch: fetchData };
};
