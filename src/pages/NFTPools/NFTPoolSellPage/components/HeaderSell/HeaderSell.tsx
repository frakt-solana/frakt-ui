import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';
import { SELL_COMMISSION_PERCENT } from '../../../constants';

interface HeaderSellProps {
  poolPublicKey: string;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
}

export const HeaderSell: FC<HeaderSellProps> = ({
  poolPublicKey,
  poolTokenInfo,
  poolTokenPrice,
}) => {
  return (
    <NFTPoolsHeaderInner poolPublicKey={poolPublicKey}>
      <HeaderSellInfo
        solanaPrice={(
          parseFloat(poolTokenPrice) *
          ((100 - SELL_COMMISSION_PERCENT) / 100)
        ).toFixed(3)}
        tokenPrice={((100 - SELL_COMMISSION_PERCENT) / 100).toFixed(3)}
        poolTokenInfo={poolTokenInfo}
      />
    </NFTPoolsHeaderInner>
  );
};
