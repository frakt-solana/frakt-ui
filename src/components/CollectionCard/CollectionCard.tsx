import { FC } from 'react';
import { transResource } from '../../utils';

import styles from './styles.module.scss';

interface CardProps {
  collectionId?: string;
  collectionName: string;
  onClick?: () => void;
  thumbnailPath: string;
}

const CollectionCard: FC<CardProps> = ({
  collectionName,
  onClick,
  thumbnailPath,
}) => {
  return (
    <div className={styles.cardContainer} onClick={onClick}>
      <div className={styles.card}>
        <div className={styles.image}>
          <img src={transResource(thumbnailPath)} />
        </div>
        <div className={styles.nameContainer}>
          <div className={styles.name}>{collectionName}</div>
        </div>
        <div className={styles.stats}>
          <div className={styles.item}>
            <div className={styles.title}># of Vaults</div>
            <div className={styles.value}>25</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}># of NFTS</div>
            <div className={styles.value}>44</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
