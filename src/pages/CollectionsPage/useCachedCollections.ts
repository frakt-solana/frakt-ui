import { useEffect, useMemo, useState } from 'react';
import { useFraktion, VaultState } from '../../contexts/fraktion';
import {
  CollectionData,
  fetchCollectionsData,
  mapVaultsByCollectionName,
  VaultsByCollectionName,
} from '../../utils/collections';

type CollectionsByName = Map<string, CollectionData>;

const collectionByIdCache = { value: new Map<string, CollectionData>() };

type UseCachedCollections = () => {
  collections: CollectionsByName;
  loading: boolean;
  vaultsNotArchivedByCollectionName: VaultsByCollectionName;
};

export const useCachedCollections: UseCachedCollections = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<CollectionsByName>(new Map());
  const { vaults, loading: loadingVaults } = useFraktion();

  const vaultsByCollectionName = useMemo(() => {
    return loading ? {} : mapVaultsByCollectionName(vaults);
  }, [loading, vaults]);

  const vaultsNotArchivedByCollectionName = useMemo(() => {
    const vaultsNotArchived = vaults.filter(
      (vault) => vault.state !== VaultState.Archived,
    );
    return loading ? {} : mapVaultsByCollectionName(vaultsNotArchived);
  }, [loading, vaults]);

  const fetchCollections = async () => {
    const collectionsNames = Object.keys(vaultsByCollectionName);
    const collectionsData = await fetchCollectionsData(collectionsNames);

    const collectionDataMap = collectionsData.reduce((acc, collection) => {
      acc.set(collection.symbol, {
        ...collection,
      });

      return acc;
    }, new Map<string, CollectionData>());

    const collectionsWithVaults = collectionsNames.reduce(
      (acc, сollectionName) => {
        const filtered = collectionDataMap.get(сollectionName);

        if (filtered) {
          acc.set(сollectionName, filtered);
        }

        return acc;
      },
      new Map(),
    );

    collectionByIdCache.value = new Map(collectionsWithVaults);

    setCollections(collectionsWithVaults);
  };

  const initialFetch = async () => {
    try {
      const isDataCached = !!collectionByIdCache.value.size;

      if (isDataCached) {
        return setCollections(collectionByIdCache.value);
      }

      setLoading(true);
      await fetchCollections();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingVaults && vaults.length) {
      initialFetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults, loadingVaults]);

  return {
    collections,
    loading,
    vaultsNotArchivedByCollectionName,
  };
};
