import { VaultData } from '../../contexts/fraktion';
import { CollectionData, VaultsByCollectionName } from './collections.model';

const COLLECTION_INFO_API = process.env.COLLECTION_URL;

export const mapVaultsByCollectionName = (
  vaults: VaultData[],
): VaultsByCollectionName => {
  return vaults.reduce((acc: VaultsByCollectionName, vault) => {
    const { safetyBoxes } = vault;
    const collectionsInVault = safetyBoxes
      .filter(({ isNftVerified }) => isNftVerified)
      .map(({ nftCollectionName }) => nftCollectionName);

    collectionsInVault.forEach((collectionName) => {
      if (!acc[collectionName]) {
        acc[collectionName] = [vault];
      } else {
        if (
          !acc[collectionName].find(
            (_vault) => _vault?.vaultPubkey === vault.vaultPubkey,
          )
        ) {
          acc[collectionName] = [...acc[collectionName], vault];
        }
      }
    });

    return acc;
  }, {});
};

export const fetchCollectionsData = async (
  previousOffset = 0,
  previousResponse = [],
): Promise<CollectionData[]> => {
  let offset = previousOffset;
  const res = await (
    await fetch(`${COLLECTION_INFO_API}?offset=${offset}&limit=${500}`)
  ).json();

  const response = [...previousResponse, ...res];

  if (res.length !== 0) {
    offset += 500;

    return fetchCollectionsData(offset, response);
  }

  return response;
};

export const compareVaultsArraysBySize = (
  vaultsA: VaultData[] = [],
  vaultsB: VaultData[] = [],
  desc = true,
): number =>
  desc ? vaultsB.length - vaultsA.length : vaultsA.length - vaultsB.length;

export const compareVaultsArraysByName = (
  nameA: string,
  nameB: string,
  desc = true,
): number => (desc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA));

export const compareVaultsArraysByNFTsAmount = (
  vaultsA: VaultData[] = [],
  vaultsB: VaultData[] = [],
  desc = true,
): number => {
  const getNftsAmount = (vaults: VaultData[]) =>
    vaults.reduce((acc, { safetyBoxes }) => {
      return acc + safetyBoxes.length;
    }, 0);

  const nftsAmountA = getNftsAmount(vaultsA);
  const nftsAmountB = getNftsAmount(vaultsB);

  return desc ? nftsAmountB - nftsAmountA : nftsAmountA - nftsAmountB;
};
