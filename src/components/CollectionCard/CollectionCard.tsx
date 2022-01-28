import { FC } from 'react';

import { getCollectionThumbnailUrl } from '../../utils';
import styles from './styles.module.scss';
import { VaultData } from '../../contexts/fraktion';

interface CollectionCardProps {
  collectionName: string;
  thumbnailPath: string;
  className?: string;
  vaultsByCollectionName: VaultData[];
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  thumbnailPath,
  vaultsByCollectionName,
}) => {
  const nftsAmount = vaultsByCollectionName.reduce((prev, curr) => {
    let temp = 0;
    curr?.safetyBoxes.forEach((nft) => {
      if (nft.nftCollectionName === collectionName) temp += 1;
    });
    return prev + temp;
  }, 0);
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${getCollectionThumbnailUrl(thumbnailPath)})`,
          }}
        />
        <h3 className={styles.name}>{collectionName}</h3>
        <div className={styles.stats}>
          <div className={styles.item}>
            <div className={styles.title}>Vaults amount</div>
            <div className={styles.value}>{vaultsByCollectionName.length}</div>
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
