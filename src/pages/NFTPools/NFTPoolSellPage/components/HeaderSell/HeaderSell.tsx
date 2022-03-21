import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';

interface HeaderSellProps {
  poolPublicKey: string;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
}

const PRICE_WITH_COMMISSION_PERCENT = 0.98;

export const HeaderSell: FC<HeaderSellProps> = ({
  poolPublicKey,
  poolTokenInfo,
  poolTokenPrice,
}) => {
  return (
    <NFTPoolsHeaderInner poolPublicKey={poolPublicKey}>
      <HeaderSellInfo
        solanaPrice={(
          parseFloat(poolTokenPrice) * PRICE_WITH_COMMISSION_PERCENT
        ).toFixed(3)}
        tokenPrice={PRICE_WITH_COMMISSION_PERCENT.toFixed(3)}
        poolTokenInfo={poolTokenInfo}
      />
    </NFTPoolsHeaderInner>
  );
};
