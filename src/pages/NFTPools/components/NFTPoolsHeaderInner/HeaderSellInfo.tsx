import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { SolanaIcon } from '../../../../icons';
import styles from './NFTPoolsHeaderInner.module.scss';

interface HeaderSellInfoProps {
  solanaPrice: number;
  tokenPrice: number;
  poolTokenInfo: TokenInfo;
}

export const HeaderSellInfo: FC<HeaderSellInfoProps> = ({
  solanaPrice,
  tokenPrice,
  poolTokenInfo,
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
          style={{ backgroundImage: `url(${poolTokenInfo?.logoURI})` }}
        />
        {poolTokenInfo?.symbol}
      </p>
    </div>
  );
};
