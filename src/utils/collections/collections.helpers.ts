import { VaultData } from '../../contexts/fraktion';
import {
  CollectionData,
  VaultsByCollectionName,
  PromiseFulfilledResult,
} from './collections.model';

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

export const fetchCollectionData = async (
  collectionName: string,
): Promise<CollectionData | null> => {
  try {
    const responseData = await (
      await fetch(`${COLLECTION_INFO_API}/${collectionName}`)
    ).json();

    return responseData || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};

export const fetchCollectionsData = async (
  collectionsNames: string[],
): Promise<CollectionData[]> => {
  try {
    const responses = await Promise.allSettled(
      collectionsNames.map((collectionName) =>
        fetchCollectionData(collectionName),
      ),
    );

    return responses
      .filter(
        ({ value, status }: PromiseFulfilledResult) =>
          status === 'fulfilled' && value,
      )
      .map(({ value }: PromiseFulfilledResult) => value as CollectionData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
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
