import { FC } from 'react';
import { getCollectionThumbnailUrl } from '../../utils';

import styles from './styles.module.scss';

interface CollectionCardProps {
  collectionName: string;
  onClick?: () => void;
  thumbnailPath: string;
  className?: string;
  vaultCount: number;
}

const CollectionCard: FC<CollectionCardProps> = ({
  collectionName,
  onClick,
  thumbnailPath,
  vaultCount,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.image}>
        <img src={getCollectionThumbnailUrl(thumbnailPath)} />
      </div>
      <div className={styles.nameContainer}>
        <div className={styles.name}>{collectionName}</div>
      </div>
      <div className={styles.stats}>
        <div className={styles.item}>
          <div className={styles.title}># of Vaults</div>
          <div className={styles.value}>{vaultCount}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}># of NFTS</div>
          <div className={styles.value}>{vaultCount}</div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
