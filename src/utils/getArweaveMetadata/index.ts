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

export interface MetadataByMint {
  [mint: string]: ArweaveMetadata;
}

export const getArweaveMetadataByMint = async (
  tokenMints: string[],
): Promise<MetadataByMint> => {
  const rawMeta = await getMeta(tokenMints, () => {}, config.ENDPOINT.endpoint);

  const metadataByMint =
    rawMeta?.reduce((acc, { mint, metadata }) => {
      acc[mint] = metadata;
      return acc;
    }, {}) || {};

  return metadataByMint as MetadataByMint;
};
