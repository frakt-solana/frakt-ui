import { useEffect, useState } from 'react';
import {
  CollectionData,
  CollectionsData,
  ResultAllCollections,
  ResultCollection,
} from './collections.model';
import { fetchAllCollections, fetchCollectionData } from './index';

export const useCollections = (): ResultAllCollections => {
  const [collections, setCollections] = useState<CollectionsData[]>([]);

  useEffect(() => {
    initCollections();
  }, []);

  const initCollections = async (): Promise<void> => {
    try {
      const data = await fetchAllCollections();
      setCollections(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return { collections, initCollections };
};

export const useCollectionsItem = (
  collectionName: string,
): ResultCollection => {
  const [collectionsItem, setCollectionsItem] = useState<Array<CollectionData>>(
    [],
  );

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
