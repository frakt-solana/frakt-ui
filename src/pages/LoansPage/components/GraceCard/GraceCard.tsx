import { FC } from 'react';
import classNames from 'classnames';

import styles from './GraceCard.module.scss';
import { Timer } from '../../../../icons';

const GraceCard: FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.nftInfo}>
        <img
          className={styles.nftImage}
          src="https://img.raydium.io/icon/6j28waP2NyoCBJrrVNHZuEzLDL25DXdNxMFsMNMxYht7.png"
        />
        <div>
          <p className={styles.nftName}>MonkeBack #4739</p>
        </div>
      </div>
      <div className={styles.statsValue}>
        <div className={classNames(styles.totalValue, styles.opacity)}>
          <p className={styles.subtitle}>floor price</p>
          <p className={styles.value}>150 SOL</p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>70 SOL</p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>Grace period</p>
          <div className={styles.wrapper}>
            <Timer className={styles.icon} />
            <div>
              <h2 className={styles.value}>47h : 14m : 11s</h2>
              <div className={styles.timeProgressWrapper}>
                <div
                  className={styles.timeProgress}
                  style={{ width: `${80}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraceCard;
