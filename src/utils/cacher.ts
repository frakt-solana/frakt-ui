import { VaultData } from '../contexts/fraktion';
import BN from 'bn.js';

const CACHE_URL = 'https://frakt-cacher-new.herokuapp.com';

const DEPRECATED_MARKETS = [
  'EQ5XjC1neq4FbqLUaeHLx48CTougsPYdsGgti4KqEFUT',
  'dvQF6YNQvQ2dQkMyt3rW7ibypCkHJDgVAJvZz6A6gZx',
];

/*
   It's a simple DAL, when cacher works on production, will create more complex DAL from this class.
   Points TODO:
   * axios, instead of fetch (for auto parsing json and applying different middlewares)
   * create middleware for transforming BN
   * create models for API
   * implement simple BN transforming protocol, for example: backend will return BN fields as fieldBN, after that middleware will change fieldBN into BN
 */

class API {
  public getVaults(): Promise<VaultData[]> {
    return fetch(`${CACHE_URL}/vaults`)
      .then((res) => res.json())
      .then((vaults) =>
        vaults.map((vault) => ({
          ...vault,
          auction: {
            auction: {
              ...vault.auction.auction,
              tickSize: new BN(vault.auction.auction.tickSize, 16),
            },
            bids: vault.auction.bids.map((bid) => ({
              ...bid,
              bidAmountPerShare: new BN(bid.bidAmountPerShare, 16),
            })),
          },
          fractionsSupply: new BN(vault.fractionsSupply, 16),
          lockedPricePerShare: new BN(vault.lockedPricePerShare, 16),
        })),
      );
  }

  public getMarkets(): Promise<
    {
      address: string;
      baseMint: string;
      programId: string;
    }[]
  > {
    return fetch(`${CACHE_URL}/markets`)
      .then((res) => res.json())
      .then((markets) =>
        markets
          .filter((market) => !DEPRECATED_MARKETS.includes(market.address))
          .map((market) => {
            return {
              address: market.ownAddress,
              baseMint: market.baseMint,
              programId: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
            };
          }),
      );
  }
}

export default new API();
