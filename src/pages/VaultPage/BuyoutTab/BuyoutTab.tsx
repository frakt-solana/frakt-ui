import { FC } from 'react';

import { VaultData } from '../../../contexts/fraktion';
import { Auction } from './Auction';

interface BuyoutTabPros {
  vaultInfo: VaultData;
}

export const BuyoutTab: FC<BuyoutTabPros> = ({ vaultInfo }) => {
  return <Auction vaultInfo={vaultInfo} />;
};
