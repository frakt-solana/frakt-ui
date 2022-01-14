import { ReactNode } from 'react';
import {
  CollectionData,
  VaultsByCollectionName,
} from '../../utils/collections';

export interface CollectionsContextInterface {
  collectionsData: CollectionData[];
  vaultsByCollectionName: VaultsByCollectionName;
  vaultsNotArchivedByCollectionName: VaultsByCollectionName;
  isCollectionsLoading: boolean;
}

export interface CollectionsProviderProps {
  children: ReactNode;
}
