import { VaultData } from '../../contexts/fraktion';
import { COLLECTION_URL } from './collections.constant';
import {
  CollectionData,
  VaultsByCollectionName,
  PromiseFulfilledResult,
} from './collections.model';

export const mapVaultsByCollectionName = (
  vaults: VaultData[],
): VaultsByCollectionName => {
  return vaults.reduce((vaultByCollectionName, vault) => {
    vault.safetyBoxes.forEach((safetyBox) => {
      if (safetyBox.isNftVerified) {
        const vaultsByCollectionName =
          vaultByCollectionName[safetyBox.nftCollectionName] || [];
        vaultByCollectionName[safetyBox.nftCollectionName] = [
          ...vaultsByCollectionName,
          vault,
        ];
      }
    });
    return vaultByCollectionName;
  }, {});
};

export const fetchCollectionData = async (
  collectionName: string,
): Promise<CollectionData | null> => {
  try {
    const responseData = await (
      await fetch(`${COLLECTION_URL}/metadata?collectionName=${collectionName}`)
    ).json();

    return responseData?.states?.live || null;
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

export const compareVaultsArraysByNFTsAmount = (
  vaultsA: VaultData[] = [],
  vaultsB: VaultData[] = [],
  desc = true,
): number => {
  const amountA = vaultsA.reduce(
    (acc, { safetyBoxes }) => acc + safetyBoxes.length,
    0,
  );
  const amountB = vaultsB.reduce(
    (acc, { safetyBoxes }) => acc + safetyBoxes.length,
    0,
  );

  return desc ? amountB - amountA : amountA - amountB;
};
