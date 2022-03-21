import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';

interface HeaderSellProps {
  poolPublicKey: string;
  poolTokenInfo: TokenInfo;
}

export const HeaderSell: FC<HeaderSellProps> = ({
  poolPublicKey,
  poolTokenInfo,
}) => {
  return (
    <NFTPoolsHeaderInner poolPublicKey={poolPublicKey}>
      <HeaderSellInfo
        solanaPrice={14.84}
        tokenPrice={0.98}
        poolTokenInfo={poolTokenInfo}
      />
    </NFTPoolsHeaderInner>
  );
};
