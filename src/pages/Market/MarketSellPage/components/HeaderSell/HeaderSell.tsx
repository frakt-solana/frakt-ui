import { FC } from 'react';

import { MarketHeaderInner } from '../../../components/MarketHeaderInner';
import { HeaderSellInfo } from '../../../components/MarketHeaderInner/HeaderSellInfo';

interface HeaderSellProps {
  poolPublicKey: string;
}

export const HeaderSell: FC<HeaderSellProps> = ({ poolPublicKey }) => {
  return (
    <MarketHeaderInner poolPublicKey={poolPublicKey}>
      <HeaderSellInfo solanaPrice={14.84} tokenPrice={0.98} />
    </MarketHeaderInner>
  );
};
