import { FC } from 'react';

import { NFTPoolsHeaderInner } from '../../../components/NFTPoolsHeaderInner';
import { HeaderSellInfo } from '../../../components/NFTPoolsHeaderInner/HeaderSellInfo';

interface HeaderSellProps {
  poolPublicKey: string;
}

export const HeaderSell: FC<HeaderSellProps> = ({ poolPublicKey }) => {
  return (
    <NFTPoolsHeaderInner poolPublicKey={poolPublicKey}>
      <HeaderSellInfo solanaPrice={14.84} tokenPrice={0.98} />
    </NFTPoolsHeaderInner>
  );
};
