import { VaultData } from '../../contexts/fraktion';

export type VaultsByCollectionName = {
  [key: string]: VaultData[];
};

export const mapVaultByCollectionName = (
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
