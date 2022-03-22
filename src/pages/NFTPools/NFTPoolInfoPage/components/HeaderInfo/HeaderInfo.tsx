import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import styles from './HeaderInfo.module.scss';
import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';

interface HeaderInfoProps {
  poolPublicKey: string;
  poolTokenInfo: TokenInfo;
  hidden?: boolean;
}

export const HeaderInfo: FC<HeaderInfoProps> = ({
  poolPublicKey,
  poolTokenInfo,
  hidden = false,
}) => {
  return (
    <NFTPoolsHeaderInner
      poolPublicKey={poolPublicKey}
      className={styles.header}
      hidden={hidden}
    >
      <div className={styles.titleWrapper}>
        <div
          className={styles.poolImage}
          style={{
            backgroundImage: `url(${poolTokenInfo?.logoURI})`,
          }}
        />
        <h2 className={styles.title}>{poolTokenInfo?.name}</h2>
      </div>
    </NFTPoolsHeaderInner>
  );
};
