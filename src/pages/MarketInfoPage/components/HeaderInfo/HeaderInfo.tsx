import React, { FC } from 'react';
import styles from './styles.module.scss';
import { MarketNavigation } from '../../../../components/MarketNavigation';

export const HeaderInfo: FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.titleWrapper}>
            <div className={styles.poolImage} />
            <h2 className={styles.title}>PUNKS</h2>
          </div>
          <MarketNavigation className={styles.marketNavigation} />
        </div>
      </div>
    </div>
  );
};
