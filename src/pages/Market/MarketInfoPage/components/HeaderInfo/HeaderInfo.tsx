import { FC } from 'react';

import styles from './styles.module.scss';
import { MarketHeaderInner } from '../../../components/MarketHeaderInner';

interface HeaderInfoProps {
  poolPublicKey: string;
}

export const HeaderInfo: FC<HeaderInfoProps> = ({ poolPublicKey }) => {
  return (
    <MarketHeaderInner poolPublicKey={poolPublicKey} className={styles.header}>
      <div className={styles.titleWrapper}>
        <div className={styles.poolImage} />
        <h2 className={styles.title}>TOKEN</h2>
      </div>
    </MarketHeaderInner>
  );
};
