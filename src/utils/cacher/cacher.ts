import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

import { HIDDEN_POOLS, NftPoolData, parseRawNftPools } from './nftPools';
import {
  convertStringLiquidityPoolKeysV4ToPublicKeys,
  LiquidityPoolKeysV4String,
} from './raydiumLiquidityPools';

const CACHER_URL = process.env.CACHER_URL;

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

  public async getAllRaydiumPoolsConfigs(): Promise<LiquidityPoolKeysV4[]> {
    const rawConfigs: LiquidityPoolKeysV4String[] = await (
      await fetch(`${CACHER_URL}/liquidity`)
    ).json();

    return (
      rawConfigs?.map((rawConfig) =>
        convertStringLiquidityPoolKeysV4ToPublicKeys(rawConfig),
      ) || []
    );
  }
}

export const Cacher = new API();
