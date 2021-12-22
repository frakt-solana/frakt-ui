import { CollectionsData } from './collection.model';

const COLLECTION_URL = 'https://api.exchange.art/v1/public/collections';

export const queryCollections = async (): Promise<CollectionsData[]> => {
  return await (await fetch(COLLECTION_URL)).json();
};

export const queryCollectionsItem = async (
  collectionName: string,
): Promise<any> => {
  try {
    const res = await fetch(
      `${COLLECTION_URL}/metadata?collectionName=${collectionName}`,
    );

    const data = await res.json();

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error');
  }
};
