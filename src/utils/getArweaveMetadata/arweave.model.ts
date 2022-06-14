import { web3 } from '@frakt-protocol/frakt-sdk';

export class Creator {
  address: web3.PublicKey;
  verified: boolean;
  share: number;

  constructor(args: {
    address: web3.PublicKey;
    verified: boolean;
    share: number;
  }) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}

export enum MetadataKey {
  Uninitialized = 0,
  MetadataV1 = 4,
  EditionV1 = 1,
  MasterEditionV1 = 2,
  MasterEditionV2 = 6,
  EditionMarker = 7,
}

export class Data {
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

export class Metadata {
  key: MetadataKey;
  updateAuthority: web3.PublicKey;
  mint: web3.PublicKey;
  data: Data;
  primarySaleHappened: boolean;
  isMutable: boolean;
  masterEdition?: web3.PublicKey;
  edition?: web3.PublicKey;
  constructor(args: {
    updateAuthority: web3.PublicKey;
    mint: web3.PublicKey;
    data: Data;
    primarySaleHappened: boolean;
    isMutable: boolean;
    masterEdition?: web3.PublicKey;
  }) {
    this.key = MetadataKey.MetadataV1;
    this.updateAuthority = args.updateAuthority;
    this.mint = args.mint;
    this.data = args.data;
    this.primarySaleHappened = args.primarySaleHappened;
    this.isMutable = args.isMutable;
  }
}

export type StringPublicKey = string;

export interface ArweaveAttribute {
  trait_type: string;
  value: number | string;
}

export interface NFTCreator {
  address: string;
  share: number;
  verified?: boolean;
}

interface NFTFile {
  type: string;
  uri: string;
}

export interface ArweaveMetadata {
  name: string;
  symbol: string;
  description: string;
  collectionName?: string;
  seller_fee_basis_points?: number;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes: ArweaveAttribute[];
  properties?: {
    creators?: NFTCreator[];
    files?: NFTFile[];
  };
}

export interface MetadataByMint {
  [mint: string]: ArweaveMetadata;
}
