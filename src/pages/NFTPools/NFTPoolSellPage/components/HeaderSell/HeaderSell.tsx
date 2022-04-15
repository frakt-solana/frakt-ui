import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';
import { SELL_COMMISSION_PERCENT } from '../../../constants';
import { NftPoolData } from '../../../../../utils/cacher/nftPools';

interface HeaderSellProps {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
  hidden?: boolean;
}

export const HeaderSell: FC<HeaderSellProps> = ({
  pool,
  poolTokenInfo,
  poolTokenPrice,
  hidden = false,
}) => {
  return (
    <NFTPoolsHeaderInner
      pool={pool}
      hidden={hidden}
      poolTokenInfo={poolTokenInfo}
    >
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
