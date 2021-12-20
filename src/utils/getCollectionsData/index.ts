// import { CollectionsResult, CollectionDataResult } from './collection.model';

const COLLECTION_URL = 'https://api.exchange.art/v1/public/collections';

export const queryCollections = async (): Promise<any> => {
  return await (await fetch(COLLECTION_URL)).json();
};

export const queryCollectionsItem = async (
  collectionName: string,
): Promise<any> => {
  return await (
    await fetch(`${COLLECTION_URL}/metadata?collectionName=${collectionName}`)
  ).json();
};
