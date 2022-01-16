import { FC } from 'react';
import { VaultData } from '../../../contexts/fraktion';
import { RedeemNFTs } from '../BuyoutTab/Auction/FinishedAuction/RedeemNFTs';

import styles from './styles.module.scss';

interface RedeemNftsFromUnfinishedVaultProps {
  vaultData: VaultData;
}

export const RedeemNftsFromUnfinishedVault: FC<RedeemNftsFromUnfinishedVaultProps> =
  ({ vaultData }) => {
    return (
      <RedeemNFTs
        className={styles.redeemNftsFromUnfinishedVault}
        vaultData={vaultData}
      />
    );
  };
