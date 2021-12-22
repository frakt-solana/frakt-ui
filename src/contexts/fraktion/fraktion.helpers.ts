import { keyBy, groupBy, Dictionary } from 'lodash';
import BN from 'bn.js';

import {
  Auction,
  Bid,
  RawAuction,
  RawBid,
  Market,
  RawVault,
  Vault,
  SafetyBox,
  RawSafetyBox,
  SafetyBoxWithMetadata,
  RawNftMetadata,
  NftMetadata,
} from './fraktion.model';
import { VaultState } from '.';
import moment from 'moment';

export const mapAuctionsByVaultPubkey = (
  rawAuctions: RawAuction[] = [],
): Dictionary<Auction> =>
  keyBy(
    rawAuctions.map(
      ({
        auctionPubkey,
        vault: vaultPubKey,
        current_winning_bid: currentWinningBidPubkey,
        started_at,
        ending_at,
        is_enabled,
        is_started,
        min_tick_size,
      }): Auction => ({
        auctionPubkey,
        vaultPubKey,
        currentWinningBidPubkey,
        startedAt: new BN(started_at, 16).toNumber() || null,
        endingAt: new BN(ending_at, 16).toNumber() || null,
        isEnabled: !!is_enabled,
        isStarted: !!is_started,
        tickSize: new BN(min_tick_size, 16), // bidPerShare * amountOfShares
      }),
    ),
    'vaultPubKey',
  );

export const mapBidsByAuctionPubkey = (
  rawBids: RawBid[] = [],
): Dictionary<Bid[]> =>
  groupBy(
    rawBids.map(
      ({
        bidPubkey,
        auction: auctionPubkey,
        bid_amount_per_share,
        bidder,
        is_canceled,
        placed_at,
      }): Bid => ({
        bidPubkey,
        auctionPubkey,
        bidAmountPerShare: new BN(bid_amount_per_share, 16),
        bidder,
        isCanceled: !!is_canceled,
        placedAt: new BN(placed_at, 16).toNumber(),
      }),
    ),
    'auctionPubkey',
  );

export const mapMarketExistenceByFractionMint = (
  markets: Market[] = [],
): Dictionary<boolean> =>
  markets.reduce((acc, { baseMint }) => {
    return { ...acc, [baseMint]: true };
  }, {});

export const mapMetadataByNftMint = (
  metas: RawNftMetadata[] = [],
): Dictionary<NftMetadata> =>
  metas.reduce(
    (metadataByNftMint, { mintAddress, fetchedMeta, isVerifiedStatus }) => {
      const { name, image, description, attributes } = fetchedMeta;
      const { success, collection } = isVerifiedStatus;
      const nftMetadata = {
        nftName: name || '',
        nftDescription: description || '',
        nftImage: image || '',
        nftAttributes: attributes || [],
        isNftVerified: !!success,
        nftCollectionName: collection || '',
      };

      return { ...metadataByNftMint, [mintAddress]: nftMetadata };
    },
    {},
  );

export const parseVaults = (rawVaults: RawVault[] = []): Vault[] =>
  rawVaults.map(
    ({
      vaultPubkey,
      key,
      tokenProgram,
      fractionMint,
      authority,
      fractionTreasury,
      redeemTreasury,
      priceMint,
      allowFurtherShareCreation,
      pricingLookupAddress,
      tokenTypeCount,
      state,
      fractionsSupply,
      lockedPricePerShare,
      createdAt,
    }): Vault => ({
      vaultPubkey,
      key,
      tokenProgram,
      fractionMint,
      authority,
      fractionTreasury,
      redeemTreasury,
      priceMint,
      allowFurtherShareCreation: !!allowFurtherShareCreation,
      pricingLookupAddress,
      tokenTypeCount,
      state,
      fractionsSupply: new BN(fractionsSupply, 16),
      lockedPricePerShare: new BN(lockedPricePerShare, 16),
      createdAt: new BN(createdAt, 16).toNumber(),
    }),
  );

export const mapSafetyBoxesByVaultPubkey = (
  rawSafetyBoxes: RawSafetyBox[] = [],
): Dictionary<SafetyBox[]> =>
  groupBy(
    rawSafetyBoxes.map(
      ({
        safetyBoxPubkey,
        vault: vaultPubkey,
        key,
        tokenMint,
        store,
        order,
      }): SafetyBox => ({
        safetyBoxPubkey,
        vaultPubkey,
        key,
        nftMint: tokenMint,
        store,
        order: new BN(order, 16).toNumber(),
      }),
    ),
    'vaultPubkey',
  );

export const transformToSafetyBoxesWithMetadata = (
  safetyBoxes: SafetyBox[] = [],
  metadataByNftMint: Dictionary<NftMetadata> = {},
): SafetyBoxWithMetadata[] =>
  safetyBoxes.map((safetyBox: SafetyBox): SafetyBoxWithMetadata => {
    const { nftMint } = safetyBox;
    const {
      nftName,
      nftDescription,
      nftImage,
      nftAttributes,
      isNftVerified,
      nftCollectionName,
    } = metadataByNftMint[nftMint];

    return {
      ...safetyBox,
      nftName,
      nftDescription,
      nftImage,
      nftAttributes,
      isNftVerified,
      nftCollectionName,
    };
  });

//? Needs because if auction's time finished but any redeem doesn't happened than Vault state will be VaultState.AuctionLive
export const getVaultRealState = (
  vaultState: VaultState,
  auction: Auction,
): VaultState => {
  if (vaultState === VaultState.AuctionLive) {
    const isAuctionEnded = auction?.endingAt < moment().unix();
    return isAuctionEnded ? VaultState.AuctionFinished : VaultState.AuctionLive;
  }

  return vaultState;
};
