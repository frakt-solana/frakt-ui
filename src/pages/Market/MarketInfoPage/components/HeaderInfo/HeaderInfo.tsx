import { FC } from 'react';

import styles from './styles.module.scss';
import { MarketNavigation } from '../../../components/MarketNavigation';

interface HeaderInfoProps {
  poolPublicKey: string;
}

export const HeaderInfo: FC<HeaderInfoProps> = ({ poolPublicKey }) => {
  return (
    <div className={styles.header}>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.titleWrapper}>
            <div className={styles.poolImage} />
            <h2 className={styles.title}>PUNKS</h2>
          </div>
          <MarketNavigation
            className={styles.marketNavigation}
            poolPublicKey={poolPublicKey}
          />
        </div>
      </div>
    </div>
  );
};
