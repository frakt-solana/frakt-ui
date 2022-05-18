import { HIDDEN_POOLS, NftPoolData, parseRawNftPools } from './nftPools';

const CACHER_URL = process.env.BFF_URL;
export const IS_BFF_ENABLED = !!CACHER_URL;

/*
   It's a simple DAL, when cacher works on production, will create more complex DAL from this class.
   Points TODO:
   * axios, instead of fetch (for auto parsing json and applying different middlewares)
   * create middleware for transforming BN
   * create models for API
   * implement simple BN transforming protocol, for example: backend will return BN fields as fieldBN, after that middleware will change fieldBN into BN
 */

class API {
  public async getNftPools(): Promise<NftPoolData[]> {
    const res = await fetch(`${CACHER_URL}/nft-pools`);
    const rawPoolsData = await res.json();

    const nftPoolData = parseRawNftPools(rawPoolsData);

    return nftPoolData.filter(
      ({ publicKey }) => !HIDDEN_POOLS.includes(publicKey.toBase58()),
    );
  }
}

export const Cacher = new API();
