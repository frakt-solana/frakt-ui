import { FC, Fragment } from 'react';
import { VaultData } from '../../../contexts/fraktion';
import { RedeemNFTs } from '../BuyoutTab/Auction/FinishedAuction/RedeemNFTs';

import styles from './styles.module.scss';

interface RedeemNftsFromUnfinishedVaultProps {
  vaultData: VaultData;
}

export const RedeemNftsFromUnfinishedVault: FC<RedeemNftsFromUnfinishedVaultProps> =
  ({ vaultData }) => {
    return vaultData.tokenTypeCount !== 0 ? (
      <div className={styles.wrapper}>
        <RedeemNFTs
          className={styles.redeemNftsFromUnfinishedVault}
          vaultData={vaultData}
        />
        <p className={styles.note}>
          *This action turns vault into finished state, please make sure you
          redeem all nfts from it
        </p>
      </div>
    ) : (
      <Fragment />
    );
  };
