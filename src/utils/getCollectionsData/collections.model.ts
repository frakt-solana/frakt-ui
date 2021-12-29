export interface CollectionsData {
  brandId: string;
  collectionId: string;
  collectionName: string;
}

export interface CollectionData {
  discord?: string;
  collectionName?: string;
  twitter?: string;
  description?: string;
  bannerPath?: string;
  website?: string;
  thumbnailPath?: string;
}

export interface ResultAllCollections {
  collections: CollectionsData[];
  initCollections: () => Promise<void>;
}

export interface ResultCollection {
  collectionsItem: CollectionData[];
  initCollectionItem: (collectionName: string) => Promise<void>;
}

export interface PromiseFulfilledResult {
  status: 'fulfilled';
  value: CollectionData[];
}
