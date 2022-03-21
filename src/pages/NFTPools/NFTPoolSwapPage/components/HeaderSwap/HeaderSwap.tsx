import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';

interface HeaderSwapProps {
  poolPublicKey: string;
  poolTokenInfo: TokenInfo;
}

export const HeaderSwap: FC<HeaderSwapProps> = ({
  poolPublicKey,
  poolTokenInfo,
}) => {
  return (
    <NFTPoolsHeaderInner poolPublicKey={poolPublicKey}>
      <HeaderSellInfo
        solanaPrice={0.3}
        tokenPrice={0.02}
        poolTokenInfo={poolTokenInfo}
      />
    </NFTPoolsHeaderInner>
  );
};
