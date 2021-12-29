import { COLLECTION_URL } from './collections.constant';
import { CollectionData, CollectionsData } from './collections.model';

export const fetchAllCollections = async (): Promise<CollectionsData[]> => {
  return await (await fetch(COLLECTION_URL)).json();
};

export const fetchCollectionData = async (
  collectionName: string,
): Promise<CollectionData[]> => {
  try {
    const responseData = await (
      await fetch(`${COLLECTION_URL}/metadata?collectionName=${collectionName}`)
    ).json();

    return responseData.states.live;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error');
  }
};
