import { useContext } from 'react';
import { CollectionsContext } from './collections.context';
import { CollectionsContextInterface } from './collections.model';

export const useCollections = (): CollectionsContextInterface => {
  const {
    collectionsData,
    vaultsByCollectionName,
    vaultsNotArchivedByCollectionName,
    isCollectionsLoading,
  } = useContext(CollectionsContext);

  return {
    collectionsData,
    vaultsByCollectionName,
    vaultsNotArchivedByCollectionName,
    isCollectionsLoading,
  };
};
