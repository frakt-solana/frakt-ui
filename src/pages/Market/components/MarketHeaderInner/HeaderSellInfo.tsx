import { FC } from 'react';

import { SolanaIcon } from '../../../../icons';
import styles from './MarketHeaderInner.module.scss';

interface HeaderSellInfoProps {
  solanaPrice: number;
  tokenPrice: number;
}

export const HeaderSellInfo: FC<HeaderSellInfoProps> = ({
  solanaPrice,
  tokenPrice,
}) => {
  return (
    <div className={styles.sellInfoWrapper}>
      <p className={styles.sellInfoItem}>
        {solanaPrice} <SolanaIcon /> SOL
      </p>
      <div className={styles.separator} />
      <p className={styles.sellInfoItem}>
        {tokenPrice}
        <span
          className={styles.infoImage}
          style={{ backgroundImage: `url(${'/'})` }}
        />
        {'TOKEN'}
      </p>
    </div>
  );
};
