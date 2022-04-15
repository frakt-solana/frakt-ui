import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';
import { NftPoolData } from '../../../../../utils/cacher/nftPools';

interface HeaderSwapProps {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
  hidden?: boolean;
}

const COMMISSION_PERCENT = 0.02;

export const HeaderSwap: FC<HeaderSwapProps> = ({
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
        solanaPrice={(parseFloat(poolTokenPrice) * COMMISSION_PERCENT).toFixed(
          3,
        )}
        tokenPrice={COMMISSION_PERCENT.toFixed(3)}
        poolTokenInfo={poolTokenInfo}
      />
    </NFTPoolsHeaderInner>
  );
};
