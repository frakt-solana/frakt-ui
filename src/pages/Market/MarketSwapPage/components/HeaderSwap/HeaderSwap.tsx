import { FC } from 'react';

import { MarketHeaderInner } from '../../../components/MarketHeaderInner';
import { HeaderSellInfo } from '../../../components/MarketHeaderInner/HeaderSellInfo';

interface HeaderSwapProps {
  poolPublicKey: string;
}

export const HeaderSwap: FC<HeaderSwapProps> = ({ poolPublicKey }) => {
  return (
    <MarketHeaderInner poolPublicKey={poolPublicKey}>
      <HeaderSellInfo />
    </MarketHeaderInner>
  );
};
