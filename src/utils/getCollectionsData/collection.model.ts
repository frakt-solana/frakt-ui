export interface CollectionsData {
  brandId: string;
  collectionId: string;
  collectionName: string;
}

export interface CollectionData {
  mintListPath?: string;
  discord?: string;
  collectionName?: string;
  secondaryCategory?: string;
  twitter?: string;
  tags?: Array<string>;
  description?: string;
  bannerPath?: string;
  tertiaryCategory?: string;
  website?: string;
  note?: string;
  thumbnailPath?: string;
  isNsfw?: boolean;
  artists?: Array<string>;
}

export interface unknownCollectionDataResult {
  collectionInfo: CollectionData;
}
