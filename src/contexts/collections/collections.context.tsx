import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  CollectionsContextInterface,
  CollectionsProviderProps,
} from './collections.model';
import {
  CollectionData,
  fetchCollectionsData,
  mapVaultsByCollectionName,
} from '../../utils/collections';
import { useFraktion, VaultState } from '../fraktion';

export const CollectionsContext =
  React.createContext<CollectionsContextInterface>({
    collectionsData: [],
    vaultsByCollectionName: {},
    vaultsNotArchivedByCollectionName: {},
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

  const vaultsNotArchivedByCollectionName = useMemo(() => {
    const vaultsNotArchived = vaults.filter(
      (vault) => vault.state !== VaultState.Archived,
    );
    return loading ? {} : mapVaultsByCollectionName(vaultsNotArchived);
  }, [loading, vaults]);

  const getCollectionItems = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const collectionsNames = Object.keys(vaultsByCollectionName);
      const collectionsData = await fetchCollectionsData();

      const collectionsWithVaults = collectionsNames.reduce(
        (acc, сollectionName) => {
          const filtered = collectionsData.filter(
            ({ name }) => name === сollectionName,
          );
          if (filtered.length) {
            acc.push(...filtered);
          }

          return acc;
        },
        [],
      );

      setCollectionsData(collectionsWithVaults);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    !loading && getCollectionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <CollectionsContext.Provider
      value={{
        collectionsData,
        vaultsByCollectionName,
        vaultsNotArchivedByCollectionName,
        isCollectionsLoading: loading || isLoading,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};
