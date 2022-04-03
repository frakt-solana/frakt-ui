import { useEffect, useMemo, useState } from 'react';
import { useFraktion } from '../../contexts/fraktion';
import {
  mapVaultsByCollectionName,
  fetchCollectionsData,
} from '../../utils/collections';
import { PoolStats } from '../PoolsPage';

type PoolsStatsByBaseTokenMint = Map<string, PoolStats>;

const poolsStatsByMarketIdCache = { value: new Map<string, PoolStats>() };

type UseCachedCollections = () => {
  collections: PoolsStatsByBaseTokenMint;
  loading: boolean;
};

export const useCachedCollections: UseCachedCollections = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<any>();

  const { vaults, loading: valutsLoading } = useFraktion();

  const vaultsByCollectionName = useMemo(() => {
    return valutsLoading ? {} : mapVaultsByCollectionName(vaults);
  }, [valutsLoading, vaults]);

  const fetchPoolsStats = async () => {
    const collectionsNames = Object.keys(vaultsByCollectionName);

    const collectionsData = await fetchCollectionsData();

    const collections = collectionsNames.reduce((acc, сollectionName) => {
      const filtered = collectionsData.filter(
        ({ name }) => name === сollectionName,
      );
      if (filtered.length) {
        acc.push(...filtered);
      }

      return acc;
    }, []);

    poolsStatsByMarketIdCache.value = new Map(collections);
    setCollections(collections);
  };

  const initialFetch = async () => {
    try {
      const isDataCached = !!poolsStatsByMarketIdCache.value.size;

      if (isDataCached) {
        return setCollections(poolsStatsByMarketIdCache.value);
      }

      setLoading(true);
      await fetchPoolsStats();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vaults.length) {
      initialFetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valutsLoading, vaults]);

  return {
    collections,
    loading,
  };
};
