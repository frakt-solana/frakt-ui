import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';

interface HeaderSwapProps {
  poolPublicKey: string;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
  hidden?: boolean;
}

const COMMISSION_PERCENT = 0.02;

export const HeaderSwap: FC<HeaderSwapProps> = ({
  poolPublicKey,
  poolTokenInfo,
  poolTokenPrice,
  hidden = false,
}) => {
  return (
    <NFTPoolsHeaderInner poolPublicKey={poolPublicKey} hidden={hidden}>
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
