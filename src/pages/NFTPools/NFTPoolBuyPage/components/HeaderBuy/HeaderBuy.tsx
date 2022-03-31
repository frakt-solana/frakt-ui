import React, { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames/bind';

import { BuyRandomNftForm } from './BuyRandomNftForm';
import { NftPoolData } from '../../../../../utils/cacher/nftPools';
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

  return (
    <NFTPoolsHeaderInner
      poolPublicKey={pool?.publicKey.toBase58()}
      className={classNames(className)}
      hidden={hidden}
    >
      <BuyRandomNftForm
        poolTokenAvailable={poolTokenAvailable}
        onBuy={onBuy}
        poolTokenInfo={poolTokenInfo}
        poolTokenPrice={poolTokenPrice}
        slippage={slippage}
        setSlippage={setSlippage}
      />
    </NFTPoolsHeaderInner>
  );
};

export const HeaderBuy = React.memo(HeaderBuyComponent);
