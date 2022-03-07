import { FC } from 'react';

import styles from './MockPoolCard.module.scss';
import { SolanaIcon } from '../../../../../../icons';

export interface MockPoolCardProps {
  collectionsAmount: string;
  nftsAmount: string;
  imageUrl: string;
  tokenName: string;
  price: string;
}

export const MockPoolCard: FC<MockPoolCardProps> = ({
  collectionsAmount,
  nftsAmount,
  imageUrl,
  tokenName,
  price,
}) => {
  return (
    <div className={styles.poolCard}>
      <div className={styles.poolImgWrapper}>
        <img src={imageUrl} alt="Pool card" className={styles.poolImage} />
        <div className={styles.poolShadow}>
          <p className={styles.poolInfoLabel}>{collectionsAmount}</p>
          <p className={styles.poolInfoLabel}>{nftsAmount}</p>
        </div>
      </div>
      <div className={styles.cardContentWrapper}>
        <div className={styles.poolTokenInfo}>
          <div
            className={styles.tokenImage}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <p className={styles.tokenName}>{tokenName}</p>
        </div>
        <span className={styles.priceLabel}>price</span>
        <div className={styles.priceWrapper}>
          <span className={styles.poolPrice}>{price}</span>
          <SolanaIcon />
          <span className={styles.priceCurrency}>SOL</span>
        </div>
      </div>
    </div>
  );
};
