import base58 from 'bs58';
import { deserializeUnchecked, BinaryReader, BinaryWriter } from 'borsh';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
export const METADATA_PREFIX = 'metadata';

class Creator {
  address: PublicKey;
  verified: boolean;
  share: number;

  constructor(args: { address: PublicKey; verified: boolean; share: number }) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}

enum MetadataKey {
  Uninitialized = 0,
  MetadataV1 = 4,
  EditionV1 = 1,
  MasterEditionV1 = 2,
  MasterEditionV2 = 6,
  EditionMarker = 7,
}

class Data {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Creator[] | null;
  constructor(args: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Creator[] | null;
  }) {
    this.name = args.name;
    this.symbol = args.symbol;
    this.uri = args.uri;
    this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
    this.creators = args.creators;
  }
}

class Metadata {
  key: MetadataKey;
  updateAuthority: PublicKey;
  mint: PublicKey;
  data: Data;
  primarySaleHappened: boolean;
  isMutable: boolean;
  masterEdition?: PublicKey;
  edition?: PublicKey;
  constructor(args: {
    updateAuthority: PublicKey;
    mint: PublicKey;
    data: Data;
    primarySaleHappened: boolean;
    isMutable: boolean;
    masterEdition?: PublicKey;
  }) {
    this.key = MetadataKey.MetadataV1;
    this.updateAuthority = args.updateAuthority;
    this.mint = args.mint;
    this.data = args.data;
    this.primarySaleHappened = args.primarySaleHappened;
    this.isMutable = args.isMutable;
  }
}

type StringPublicKey = string;

const PubKeysInternedMap = new Map<string, PublicKey>();

const toPublicKey = (key: string | PublicKey) => {
  if (typeof key !== 'string') {
    return key;
  }

  let result = PubKeysInternedMap.get(key);
  if (!result) {
    result = new PublicKey(key);
    PubKeysInternedMap.set(key, result);
  }

  return result;
};

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

const BPF_UPGRADE_LOADER_ID = new PublicKey(
  'BPFLoaderUpgradeab1e11111111111111111111111',
);

const MEMO_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

const METADATA_PROGRAM_ID =
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as StringPublicKey;

const VAULT_ID =
  'vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn' as StringPublicKey;

const AUCTION_ID =
  'auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8' as StringPublicKey;

const METAPLEX_ID =
  'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98' as StringPublicKey;

const SYSTEM = new PublicKey('11111111111111111111111111111111');

const METADATA_SCHEMA = new Map<any, any>([
  [
    Data,
    {
      kind: 'struct',
      fields: [
        ['name', 'string'],
        ['symbol', 'string'],
        ['uri', 'string'],
        ['sellerFeeBasisPoints', 'u16'],
        ['creators', { kind: 'option', type: [Creator] }],
      ],
    },
  ],
  [
    Creator,
    {
      kind: 'struct',
      fields: [
        ['address', [32]],
        ['verified', 'u8'],
        ['share', 'u8'],
      ],
    },
  ],
  [
    Metadata,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['updateAuthority', [32]],
        ['mint', [32]],
        ['data', Data],
        ['primarySaleHappened', 'u8'],
        ['isMutable', 'u8'],
      ],
    },
  ],
]);

const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey,
) => {
  const result = await PublicKey.findProgramAddress(seeds, programId);

  return [result[0].toBase58(), result[1]] as [string, number];
};

const programIds = () => {
  return {
    token: TOKEN_PROGRAM_ID,
    associatedToken: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    bpf_upgrade_loader: BPF_UPGRADE_LOADER_ID,
    system: SYSTEM,
    metadata: METADATA_PROGRAM_ID,
    memo: MEMO_ID,
    vault: VAULT_ID,
    auction: AUCTION_ID,
    metaplex: METAPLEX_ID,
  };
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

const extendBorsh = () => {
  (BinaryReader.prototype as any).readPubkey = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return new PublicKey(array);
  };

  (BinaryWriter.prototype as any).writePubkey = function (value: any) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(value.toBuffer());
  };

  (BinaryReader.prototype as any).readPubkeyAsString = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return base58.encode(array) as StringPublicKey;
  };

  (BinaryWriter.prototype as any).writePubkeyAsString = function (
    value: StringPublicKey,
  ) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(base58.decode(value));
  };
};

extendBorsh();

async function getMetadata(pubkey: PublicKey, url: string) {
  let metadata;

  try {
    const metadataPromise = await fetchMetadataFromPDA(pubkey, url);

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
  const PROGRAM_IDS = programIds();

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

async function fetchMetadataFromPDA(pubkey: PublicKey, url: string) {
  const connection = new anchor.web3.Connection(url);
  const metadataKey = await getMetadataKey(pubkey.toBase58());
  const metadataInfo = await connection.getAccountInfo(
    toPublicKey(metadataKey),
  );

  return metadataInfo;
}

const createJsonObject = (url: string) => {
  const mints = [];
  return async (mint: string): Promise<unknown> => {
    const tokenMetadata = await getMetadata(
      new anchor.web3.PublicKey(mint),
      url,
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
              address: new PublicKey(d.address).toBase58(),
              verified: !!d.verified,
            };
          }) || null,
      },
      metadata: arweaveData,
      mint: mint,
    });
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mints);
      }, 150);
    });
  };
};

const resolveSequentially = (mints: string[], func) => {
  return mints.reduce((previousPromise, mint) => {
    return previousPromise
      .then(() => {
        return func(mint);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err); //? Remove errors from console. Uncomment on debug
      });
  }, Promise.resolve());
};

export const getMeta = async (
  tokens: string[],
  url: string,
): Promise<any[]> => {
  const mints = await resolveSequentially(tokens, createJsonObject(url));
  return mints;
};
