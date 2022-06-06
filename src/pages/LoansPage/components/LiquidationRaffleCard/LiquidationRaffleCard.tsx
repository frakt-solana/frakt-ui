import { FC } from 'react';
import Button from '../../../../components/Button';
import { Ticket } from '../../../../icons';
import styles from './LiquidationRaffleCard.module.scss';

const LiquidationRaffleCard: FC = () => {
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
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>floor price</p>
          <p className={styles.value}>150 SOL</p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>70 SOL</p>
        </div>
        <Button type="alternative" className={styles.btn}>
          <Ticket className={styles.ticket} />
          Try
        </Button>
      </div>
    </div>
  );
};

export default LiquidationRaffleCard;
