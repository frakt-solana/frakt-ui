import { FC } from 'react';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';

interface HeaderSwapProps {
  poolPublicKey: string;
}

export const HeaderSwap: FC<HeaderSwapProps> = ({ poolPublicKey }) => {
  return (
    <NFTPoolsHeaderInner poolPublicKey={poolPublicKey}>
      <HeaderSellInfo solanaPrice={0.3} tokenPrice={0.02} />
    </NFTPoolsHeaderInner>
  );
};
