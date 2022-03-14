import { FC } from 'react';

import styles from './HeaderInfo.module.scss';
import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';

interface HeaderInfoProps {
  poolPublicKey: string;
}

export const HeaderInfo: FC<HeaderInfoProps> = ({ poolPublicKey }) => {
  return (
    <NFTPoolsHeaderInner
      poolPublicKey={poolPublicKey}
      className={styles.header}
    >
      <div className={styles.titleWrapper}>
        <div className={styles.poolImage} />
        <h2 className={styles.title}>TOKEN</h2>
      </div>
    </NFTPoolsHeaderInner>
  );
};
