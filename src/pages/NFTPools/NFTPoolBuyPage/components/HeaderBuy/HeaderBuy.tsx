import React, { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames/bind';

import styles from './HeaderBuy.module.scss';
import { QuestionIcon } from '../../../../../icons';
import { BuyRandomNftForm } from './BuyRandomNftForm';
import {
  NftPoolData,
  SafetyDepositBoxState,
} from '../../../../../utils/cacher/nftPools';
import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { useNftPoolTokenBalance } from '../../../hooks';

interface HeaderBuyProps {
  pool: NftPoolData;
  onBuy: (needSwap?: boolean) => void;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
  slippage: number;
  setSlippage: (nextValue: number) => void;
  className?: string;
  hidden?: boolean;
}

const HeaderBuyComponent: FC<HeaderBuyProps> = ({
  pool,
  onBuy,
  poolTokenInfo,
  poolTokenPrice,
  slippage,
  setSlippage,
  className,
  hidden,
}) => {
  const { balance } = useNftPoolTokenBalance(pool);
  const poolTokenAvailable = balance >= 1;

  const poolImage = pool?.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  return (
    <NFTPoolsHeaderInner
      poolPublicKey={pool?.publicKey.toBase58()}
      className={classNames(styles.header, className)}
      hidden={hidden}
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
          slippage={slippage}
          setSlippage={setSlippage}
        />
      </div>
    </NFTPoolsHeaderInner>
  );
};

export const HeaderBuy = React.memo(HeaderBuyComponent);
