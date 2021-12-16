import Axios from 'axios';
import { CollectionsResult, CollectionDataResult } from './collection.model';

const axios = Axios.create({
  baseURL: 'https://api.exchange.art/v1/',
});

export const queryCollections = (): Promise<CollectionsResult> =>
  axios.get('/public/collections');

export const queryCollectionsItem = (
  collectionName: string,
): Promise<CollectionDataResult> =>
  axios.get(`/public/collections/metadata?collectionName=${collectionName}`);
