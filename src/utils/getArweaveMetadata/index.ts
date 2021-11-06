import config from '../../config';
import { getMeta } from './lib';

export interface ArweaveAttribute {
  trait_type: string;
  value: number | string;
}

export interface ArweaveMetadata {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points?: number;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: ArweaveAttribute[];
  properties: any;
}

export const getArweaveMetadata = async (
  tokenMints: string[],
): Promise<any> => {
  const result = await getMeta(tokenMints, () => {}, config.ENDPOINT.endpoint);

  return result;
};
