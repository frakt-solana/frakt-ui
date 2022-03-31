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
  const poolImage = poolTokenInfo?.logoURI;

  return (
    <NFTPoolsHeaderInner
      poolPublicKey={poolPublicKey}
      className={styles.header}
      hidden={hidden}
    >
      <div className={styles.wrapper}>
        <img src={poolImage} alt="Pool image" className={styles.poolBgImage} />
        <h2 className={styles.title}>{poolTokenInfo?.name}</h2>
      </div>
    </NFTPoolsHeaderInner>
  );
};
