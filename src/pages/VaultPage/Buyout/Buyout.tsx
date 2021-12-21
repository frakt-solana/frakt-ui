import { VaultData } from '../../../contexts/fraktion';
import { Auction } from './Auction';

export const Buyout = ({
  vaultInfo,
}: {
  vaultInfo: VaultData;
}): JSX.Element => {
  return <Auction vaultInfo={vaultInfo} />;
};
