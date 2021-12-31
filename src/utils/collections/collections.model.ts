import { VaultData } from '../../contexts/fraktion';

export interface CollectionData {
  discord?: string;
  collectionName?: string;
  twitter?: string;
  description?: string;
  bannerPath?: string;
  website?: string;
  thumbnailPath?: string;
}

export interface PromiseFulfilledResult {
  status: 'fulfilled';
  value: CollectionData;
}

export type VaultsByCollectionName = {
  [key: string]: VaultData[];
};
