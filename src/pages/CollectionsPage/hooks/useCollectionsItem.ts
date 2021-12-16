import { useEffect, useState } from 'react';

const useCollectionsItem = (
  fetchCollections: (collectionName: string) => Promise<any>,
  collectionName: string,
) => {
  const [collectionsItem, setCollectionsItem] = useState([]);

  useEffect(() => {
    initCollectionItem(collectionName);
  }, []);

  const initCollectionItem = async (collectionName: string): Promise<void> => {
    try {
      const data = await fetchCollections(collectionName);
      setCollectionsItem(data);
    } catch (error) {
      console.log(error);
    }
  };

  return { collectionsItem, initCollectionItem };
};

export default useCollectionsItem;
