import { FC } from 'react';

import { getCollectionThumbnailUrl } from '../../utils';
import styles from './styles.module.scss';

interface CollectionCardProps {
  collectionName: string;
  thumbnailPath: string;
  className?: string;
  vaultsByCollectionName: any;
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  thumbnailPath,
  vaultsByCollectionName,
}) => {
  const nftsAmount = vaultsByCollectionName.reduce((prev, curr) => {
    return prev + curr?.safetyBoxes.length;
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
