import { GetVaults, Vault, VaultData } from './fraktion.model';
import {
  VAULTS_AND_META_CACHE_URL,
  ADDITIONAL_VERIFIED_VAULTS,
} from './fraktion.constants';
import {
  getVaultState,
  mapAuctionsByVaultPubkey,
  mapBidsByAuctionPubkey,
  mapMarketExistenceByFractionMint,
  mapMetadataByNftMint,
  mapSafetyBoxesByVaultPubkey,
  parseVaults,
  transformToSafetyBoxesWithMetadata,
} from './fraktion.helpers';
import { Cacher, IS_BFF_ENABLED } from '../../utils/cacher';

export const getVaultsFromBff: GetVaults = () => {
  return Cacher.getVaults();
};

export const getVaultsFromOldCacher: GetVaults = async (markets) => {
  const { allVaults, metas } = await (
    await fetch(VAULTS_AND_META_CACHE_URL)
  ).json();

  const marketExistenceByFractionMint =
    mapMarketExistenceByFractionMint(markets);

  const vaults = parseVaults(allVaults?.vaults);
  const safetyBoxesByVaultPubkey = mapSafetyBoxesByVaultPubkey(
    allVaults?.safetyBoxes,
  );
  const auctionByVaultPubkey = mapAuctionsByVaultPubkey(allVaults?.auctions);
  const bidsByAuctionPubkey = mapBidsByAuctionPubkey(allVaults?.bids);
  const metadataByNftMint = mapMetadataByNftMint(metas);

  const vaultsData = vaults.map((vault: Vault): VaultData => {
    const { vaultPubkey, fractionMint } = vault;
    const relatedSafetyBoxes = safetyBoxesByVaultPubkey[vaultPubkey] || [];
    const relatedAuction = auctionByVaultPubkey[vaultPubkey] || null;
    const relatedBids =
      bidsByAuctionPubkey[relatedAuction?.auctionPubkey] || [];

    const relatedSafetyBoxesWithMetadata = transformToSafetyBoxesWithMetadata(
      relatedSafetyBoxes,
      metadataByNftMint,
    );

    //? Vault verified only if all nfts are verified
    //? Added short-term solution to verify vaults
    const isVaultVerified =
      ADDITIONAL_VERIFIED_VAULTS.includes(vaultPubkey) ||
      relatedSafetyBoxesWithMetadata.every(
        ({ isNftVerified }) => isNftVerified,
      );

    return {
      ...vault,
      //? set state of auction for frontend requirements (more info in getVaultRealState description)
      state: getVaultState(vault.state, relatedAuction),
      realState: vault.state,
      isVerified: isVaultVerified,
      hasMarket: marketExistenceByFractionMint[fractionMint] || false,
      safetyBoxes: relatedSafetyBoxesWithMetadata,
      auction: {
        auction: relatedAuction,
        bids: relatedBids,
      },
    };
  });

  return vaultsData;
};

export const getVaults = IS_BFF_ENABLED
  ? getVaultsFromBff
  : getVaultsFromOldCacher;
