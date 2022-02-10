import { GetVaults, Vault, VaultData } from './fraktion.model';
import { VAULTS_AND_META_CACHE_URL } from './fraktion.constants';
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

export const getVaults: GetVaults = async (markets) => {
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
    const isVaultVerified = relatedSafetyBoxesWithMetadata.every(
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
