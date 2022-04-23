import { FC } from 'react';

import styles from './styles.module.scss';
import { VaultData } from '../../contexts/fraktion';

interface CollectionCardProps {
  collectionName: string;
  collectionImage: string;
  collectionSymbol: string;
  className?: string;
  vaultsByCollectionName: VaultData[];
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  collectionImage,
  vaultsByCollectionName,
  collectionSymbol,
}) => {
  const nftsAmount = vaultsByCollectionName.reduce(
    (acc: VaultData[], curr, index, self) => {
      if (
        index ===
        self.findIndex((vault) => {
          if (vault.vaultPubkey === curr.vaultPubkey) return acc;
        })
      )
        curr?.safetyBoxes.forEach((nft) => {
          if (nft.nftCollectionName === collectionSymbol) acc.push(curr);
        });
      return acc;
    },
    [],
  ).length;

  const vaultsAmount = vaultsByCollectionName.filter(
    (value, index, self) =>
      index ===
      self.findIndex((vault) => vault.vaultPubkey === value.vaultPubkey),
  ).length;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${collectionImage})`,
          }}
        />
        <h3 className={styles.name}>{collectionName}</h3>
        <div className={styles.stats}>
          <div className={styles.item}>
            <div className={styles.title}>Vaults amount</div>
            <div className={styles.value}>{vaultsAmount}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>NFTs amount</div>
            <div className={styles.value}>{nftsAmount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
