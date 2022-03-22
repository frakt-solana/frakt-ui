import React, { FC } from 'react';

import styles from './HeaderBuy.module.scss';
import { QuestionIcon } from '../../../../../icons';
import { BuyRandomNftForm } from './BuyRandomNftForm';
import {
  NftPoolData,
  SafetyDepositBoxState,
} from '../../../../../utils/cacher/nftPools';
import { useNftPoolTokenBalance } from '../../../hooks';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { TokenInfo } from '@solana/spl-token-registry';

interface HeaderBuyProps {
  pool: NftPoolData;
  onBuy: (needSwap?: boolean) => void;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
}

const HeaderBuyComponent: FC<HeaderBuyProps> = ({
  pool,
  onBuy,
  poolTokenInfo,
  poolTokenPrice,
}) => {
  const { balance } = useNftPoolTokenBalance(pool);
  const poolTokenAvailable = balance >= 1;

  const poolImage = pool?.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  return (
    <NFTPoolsHeaderInner
      poolPublicKey={pool?.publicKey.toBase58()}
      className={styles.header}
    >
      <div className={styles.randomWrapper}>
        <div className={styles.questionWrapper}>
          <img
            src={poolImage}
            alt="Pool image"
            className={styles.poolBgImage}
          />
          <QuestionIcon className={styles.questionIcon} />
        </div>
        <BuyRandomNftForm
          poolTokenAvailable={poolTokenAvailable}
          onBuy={onBuy}
          poolTokenInfo={poolTokenInfo}
          poolTokenPrice={poolTokenPrice}
        />
      </div>
    </NFTPoolsHeaderInner>
  );
};

export const HeaderBuy = React.memo(HeaderBuyComponent);
