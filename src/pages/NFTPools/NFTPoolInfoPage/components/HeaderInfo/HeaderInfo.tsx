import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import styles from './HeaderInfo.module.scss';
import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { NftPoolData } from '../../../../../utils/cacher/nftPools';

interface HeaderInfoProps {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
  hidden?: boolean;
}

export const HeaderInfo: FC<HeaderInfoProps> = ({
  pool,
  poolTokenInfo,
  hidden = false,
}) => {
  const poolImage = poolTokenInfo?.logoURI;

  return (
    <NFTPoolsHeaderInner
      pool={pool}
      className={styles.header}
      hidden={hidden}
      poolTokenInfo={poolTokenInfo}
    >
      <div className={styles.wrapper}>
        <img src={poolImage} alt="Pool image" className={styles.poolBgImage} />
        <h2 className={styles.title}>{poolTokenInfo?.name}</h2>
      </div>
    </NFTPoolsHeaderInner>
  );
};
