import { VaultData } from '../../../contexts/fraktion';
import { BuyoutVault } from './BuyoutVault';
import { Auction } from './Auction';

export const Buyout = ({
  vaultInfo,
}: {
  vaultInfo: VaultData;
}): JSX.Element => {
  const isAuction = true;

  return (
    <>
      {!isAuction && <BuyoutVault vaultInfo={vaultInfo} />}
      {isAuction && <Auction />}
    </>
  );
};
