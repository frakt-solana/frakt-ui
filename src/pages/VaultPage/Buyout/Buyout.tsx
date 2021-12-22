import { VaultData } from '../../../contexts/fraktion';
import { BuyoutVault } from './BuyoutVault';
import { Auction } from './Auction';
import { isEmpty } from 'lodash';

export const Buyout = ({
  vaultInfo,
}: {
  vaultInfo: VaultData;
}): JSX.Element => {
  const isAuction = !isEmpty(vaultInfo.auction?.auction);
  return (
    <>
      {!isAuction && <BuyoutVault vaultInfo={vaultInfo} />}
      {isAuction && <Auction vaultInfo={vaultInfo} />}
    </>
  );
};
