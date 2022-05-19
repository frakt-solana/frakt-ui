import { ENDPOINT } from '../../config';
import { getMeta } from './lib';
import { MetadataByMint } from './arweave.model';

export const getArweaveMetadataByMint = async (
  tokenMints: string[],
): Promise<MetadataByMint> => {
  const rawMeta = await getMeta(tokenMints, ENDPOINT);

  const metadataByMint =
    rawMeta?.reduce((acc, { mint, metadata, tokenData }) => {
      acc[mint] = {
        ...metadata,
        properties: {
          ...metadata?.properties,
          creators: tokenData?.creators,
        },
      };
      return acc;
    }, {}) || {};

  return metadataByMint as MetadataByMint;
};

export * from './arweave.model';
