import { VaultData } from '../../contexts/fraktion';
import {
  CollectionData,
  VaultsByCollectionName,
  PromiseFulfilledResult,
} from './collections.model';

const EXCHANGE_COLLECTION_INFO_API = process.env.REACT_APP_COLLECTION_URL;

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
      await fetch(
        `${EXCHANGE_COLLECTION_INFO_API}/metadata?collectionName=${collectionName}`,
      )
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

export const compareVaultsArraysByName = (
  nameA: string,
  nameB: string,
  desc = true,
): number => (desc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA));

export const compareVaultsArraysByNFTsAmount = (
  collectionNameA: string,
  collectionNameB: string,
  vaultsNotArchivedByCollectionName: { [key: string]: VaultData[] },
  desc = true,
): number => {
  const amountA =
    vaultsNotArchivedByCollectionName[collectionNameA] ||
    [].reduce((acc, vault) => {
      vault?.safetyBoxes.forEach((nft) => {
        if (nft.nftCollectionName === collectionNameA) acc.push(nft);
      });
      return acc;
    }, []);
  const amountB =
    vaultsNotArchivedByCollectionName[collectionNameB] ||
    [].reduce((acc, vault) => {
      vault?.safetyBoxes.forEach((nft) => {
        if (nft.nftCollectionName === collectionNameB) acc.push(nft);
      });
      return acc;
    }, []);

  return desc
    ? amountB.length - amountA.length
    : amountA.length - amountB.length;
};
