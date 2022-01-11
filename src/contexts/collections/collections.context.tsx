import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import {
  CollectionsContextInterface,
  CollectionsProviderProps,
} from './collections.model';
import {
  CollectionData,
  fetchCollectionsData,
  mapVaultsByCollectionName,
} from '../../utils/collections';
import { useFraktion } from '../fraktion';

export const CollectionsContext =
  React.createContext<CollectionsContextInterface>({
    collectionsData: [],
    vaultsByCollectionName: {},
    isCollectionsLoading: true,
  });

export const CollectionsProvider: FC<CollectionsProviderProps> = ({
  children,
}) => {
  const [collectionsData, setCollectionsData] = useState<CollectionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { vaults, loading } = useFraktion();

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultsByCollectionName(vaults);
  }, [loading, vaults]);

  const getCollectionItems = async (): Promise<void> => {
    const collectionsNames = Object.keys(vaultsByCollectionName);
    const collectionsData = await fetchCollectionsData(collectionsNames);
    setCollectionsData(collectionsData);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    !loading && getCollectionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <CollectionsContext.Provider
      value={{
        collectionsData,
        vaultsByCollectionName,
        isCollectionsLoading: loading || isLoading,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = (): CollectionsContextInterface => {
  const { collectionsData, vaultsByCollectionName, isCollectionsLoading } =
    useContext(CollectionsContext);

  return { collectionsData, vaultsByCollectionName, isCollectionsLoading };
};
