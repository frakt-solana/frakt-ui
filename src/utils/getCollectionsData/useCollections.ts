import { useEffect, useState } from 'react';
import { CollectionsData } from './collection.model';
import { queryCollections } from './index';

interface CollectionsProps {
  collections: CollectionsData[];
  initCollections: () => Promise<void>;
}

const useCollections = (): CollectionsProps => {
  const [collections, setCollections] = useState<CollectionsData[]>([]);

  useEffect(() => {
    initCollections();
  }, []);

  const initCollections = async (): Promise<void> => {
    try {
      const data = await queryCollections();
      setCollections(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return { collections, initCollections };
};

export default useCollections;
