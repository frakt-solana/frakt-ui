import { FC } from 'react';

import { getCollectionThumbnailUrl } from '../../utils';
import styles from './styles.module.scss';

interface CollectionCardProps {
  collectionName: string;
  thumbnailPath: string;
  className?: string;
  vaultCount: number;
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  thumbnailPath,
  vaultCount,
}) => {
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
            <div className={styles.value}>{vaultCount}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>NFTs amount</div>
            <div className={styles.value}>{vaultCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
