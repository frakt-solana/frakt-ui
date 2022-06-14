import { deserializeUnchecked } from 'borsh';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { Metadata, StringPublicKey } from './arweave.model';
import {
  METADATA_SCHEMA,
  METADATA_PREFIX,
  PROGRAM_IDS,
} from './arweave.constant';

const PubKeysInternedMap = new Map<string, web3.PublicKey>();
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toPublicKey = (key: string | web3.PublicKey) => {
  if (typeof key !== 'string') {
    return key;
  }

  let result = PubKeysInternedMap.get(key);
  if (!result) {
    result = new web3.PublicKey(key);
    PubKeysInternedMap.set(key, result);
  }

  return result;
};

const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: web3.PublicKey,
) => {
  const result = await web3.PublicKey.findProgramAddress(seeds, programId);

  return [result[0].toBase58(), result[1]] as [string, number];
};

const decodeMetadata = (buffer: Buffer): Metadata => {
  const metadata = deserializeUnchecked(
    METADATA_SCHEMA,
    Metadata,
    buffer,
  ) as Metadata;

  metadata.data.name = metadata.data.name.replace(/\0/g, '');
  metadata.data.symbol = metadata.data.symbol.replace(/\0/g, '');
  metadata.data.uri = metadata.data.uri.replace(/\0/g, '');
  metadata.data.name = metadata.data.name.replace(/\0/g, '');
  return metadata;
};

async function getMetadata(
  pubkey: web3.PublicKey,
  connection: web3.Connection,
) {
  let metadata;

  try {
    const metadataPromise = await fetchMetadataFromPDA(pubkey, connection);

    if (metadataPromise && metadataPromise.data.length > 0) {
      metadata = decodeMetadata(metadataPromise.data);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return metadata;
}

async function getMetadataKey(
  tokenMint: StringPublicKey,
): Promise<StringPublicKey> {
  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        toPublicKey(PROGRAM_IDS.metadata).toBuffer(),
        toPublicKey(tokenMint).toBuffer(),
      ],
      toPublicKey(PROGRAM_IDS.metadata),
    )
  )[0];
}

async function fetchMetadataFromPDA(
  pubkey: web3.PublicKey,
  connection: web3.Connection,
) {
  const metadataKey = await getMetadataKey(pubkey.toBase58());

  return await connection.getAccountInfo(toPublicKey(metadataKey));
}

const createJsonObject = (connection: web3.Connection) => {
  const mints = [];
  return async (mint: string): Promise<unknown> => {
    const tokenMetadata = await getMetadata(
      new web3.PublicKey(mint),
      connection,
    );
    if (!tokenMetadata) {
      return mints;
    }
    const arweaveData = await fetch(tokenMetadata.data.uri)
      .then((res) => res.json().catch())
      .catch(() => {
        mints.push({ tokenMetadata, failed: true });
      });
    mints.push({
      tokenData: {
        ...tokenMetadata.data,
        creators:
          tokenMetadata.data.creators?.map((d) => {
            return {
              share: d.share,
              address: new web3.PublicKey(d.address).toBase58(),
              verified: !!d.verified,
            };
          }) || null,
      },
      metadata: arweaveData,
      mint: mint,
    });

    await wait(150);
    return mints;
  };
};

const resolveSequentially = (mints: string[], func) => {
  return mints.reduce((previousPromise, mint) => {
    return previousPromise.then(() => func(mint));
  }, Promise.resolve());
};

export const getMeta = async (
  tokens: string[],
  connection: web3.Connection,
): Promise<any[]> =>
  await resolveSequentially(tokens, createJsonObject(connection));
