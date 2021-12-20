import React from 'react';
import { transResource } from '../../helpers/data-to-props';
import styles from './styles.module.scss';

interface CollectionCardProps {
  collectionId?: string;
  collectionName: string;
  onClick?: () => void;
  thumbnailPath: string;
}

const CollectionCard = ({
  collectionName,
  onClick,
  thumbnailPath,
}: CollectionCardProps): JSX.Element => {
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
