import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { SolanaIcon } from '../../../../icons';
import styles from './NFTPoolsHeaderInner.module.scss';

interface HeaderSellInfoProps {
  solanaPrice: string;
  tokenPrice: string;
  poolTokenInfo: TokenInfo;
}

export const HeaderSellInfo: FC<HeaderSellInfoProps> = ({
  solanaPrice,
  tokenPrice,
  poolTokenInfo,
}) => {
  const poolImage = poolTokenInfo?.logoURI;

  return (
    <div className={styles.headerSell}>
      <img src={poolImage} alt="Pool image" className={styles.poolBgImage} />
      <div className={styles.sellInfoWrapper}>
        <p className={styles.sellInfoItem}>
          {solanaPrice} <SolanaIcon /> SOL
        </p>
        <div className={styles.separator} />
        <p className={styles.sellInfoItem}>
          {tokenPrice}
          <span
            className={styles.infoImage}
            style={{ backgroundImage: `url(${poolTokenInfo?.logoURI})` }}
          />
          {poolTokenInfo?.symbol}
        </p>
      </div>
    </div>
  );
};
