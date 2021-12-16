import { useEffect, useState } from 'react';

const useCollections = (fetchCollections: () => Promise<any>) => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    initCollections();
  }, []);

  const initCollections = async (): Promise<void> => {
    try {
      const { data } = await fetchCollections();
      setCollections(data);
    } catch (error) {
      console.log(error);
    }
  };

  return { collections, initCollections };
};

export default useCollections;
