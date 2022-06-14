import { web3 } from '@frakt-protocol/frakt-sdk';

import { getMeta } from './lib';
import { MetadataByMint } from './arweave.model';

export const getArweaveMetadataByMint = async (
  tokenMints: string[],
  connection: web3.Connection,
): Promise<MetadataByMint> => {
  const rawMeta = await getMeta(tokenMints, connection);

  const metadataByMint =
    rawMeta
      ?.filter(({ failed }) => !failed)
      ?.reduce((acc, { mint, metadata, tokenData }) => {
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
