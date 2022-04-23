import { VaultData } from '../../contexts/fraktion';

export interface CollectionData {
  discord?: string;
  name?: string;
  twitter?: string;
  description?: string;
  website?: string;
  image?: string;
  symbol?: string;
}

export interface PromiseFulfilledResult {
  status: 'fulfilled';
  value: CollectionData;
}

export type VaultsByCollectionName = {
  [key: string]: VaultData[];
};
