import BN from 'bn.js';

import { VaultData, VaultState } from '../../contexts/fraktion';
import { DEPRECATED_MARKETS } from '../markets';
import { HIDDEN_POOLS, NftPoolData, parseRawNftPools } from './nftPools';
import {
  getVerifiedVaultsByFraktTeam,
  IGNORE_DELISTED_NFTS_VAULTS_PUBKEYS,
} from './vaults';

const CACHER_URL = process.env.BFF_URL;
export const IS_BFF_ENABLED = !!CACHER_URL;

const REACT_APP_SERUM_MARKET_PROGRAM_PUBKEY =
  process.env.SERUM_MARKET_PROGRAM_PUBKEY;

/*
   It's a simple DAL, when cacher works on production, will create more complex DAL from this class.
   Points TODO:
   * axios, instead of fetch (for auto parsing json and applying different middlewares)
   * create middleware for transforming BN
   * create models for API
   * implement simple BN transforming protocol, for example: backend will return BN fields as fieldBN, after that middleware will change fieldBN into BN
 */

class API {
  public async getVaults(): Promise<VaultData[]> {
    const res = await fetch(`${CACHER_URL}/vaults`);
    const vaults = await res.json();

    const additionalVerifiedVaults = await getVerifiedVaultsByFraktTeam();

    return vaults.map((vault: VaultData) => {
      const isDinoDaoVault =
        vault.vaultPubkey === 'Uzp4nRWuZozb36PbjepYJGM5Q44Bqiw1nYrDfQC1Hd1';

      const isPricingLookupAddressUnset =
        vault.pricingLookupAddress === '11111111111111111111111111111111';

      const safetyBoxes = IGNORE_DELISTED_NFTS_VAULTS_PUBKEYS.includes(
        vault.vaultPubkey,
      )
        ? vault.safetyBoxes
        : vault.safetyBoxes.filter(
            ({ store }) => store !== '11111111111111111111111111111111',
          );

      return {
        ...vault,
        isVerified:
          vault.isVerified ||
          additionalVerifiedVaults.includes(vault.vaultPubkey),
        auction: {
          auction: vault.auction.auction
            ? {
                ...vault.auction.auction,
                tickSize: new BN(vault.auction.auction?.tickSize, 16),
              }
            : {},
          bids: vault.auction.bids.map((bid) => ({
            ...bid,
            bidAmountPerShare: new BN(bid.bidAmountPerShare, 16),
          })),
        },
        fractionsSupply: new BN(vault.fractionsSupply, 16),
        lockedPricePerShare: new BN(vault.lockedPricePerShare, 16),
        state:
          isDinoDaoVault && isPricingLookupAddressUnset
            ? VaultState.Active
            : vault.state,
        realState:
          isDinoDaoVault && isPricingLookupAddressUnset
            ? VaultState.Active
            : vault.realState,
        safetyBoxes,
      };
    });
  }

  public async getMarkets(): Promise<
    {
      address: string;
      baseMint: string;
      programId: string;
    }[]
  > {
    const res = await fetch(`${CACHER_URL}/markets`);
    const markets = await res.json();

    return markets
      .filter((market) => !DEPRECATED_MARKETS.includes(market.address))
      .map((market) => {
        return {
          address: market.ownAddress,
          baseMint: market.baseMint,
          programId: REACT_APP_SERUM_MARKET_PROGRAM_PUBKEY,
        };
      });
  }

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
