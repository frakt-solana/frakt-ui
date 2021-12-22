const COLLECTION_URL = 'https://api.exchange.art/v1/public/collections';

export const queryCollections = async (): Promise<any> => {
  return await (await fetch(COLLECTION_URL)).json();
};

export const queryCollectionsItem = async (
  collectionName: string,
): Promise<any> => {
  try {
    return await (
      await fetch(`${COLLECTION_URL}/metadata?collectionName=${collectionName}`)
    ).json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
