import styles from './styles.module.scss';
import { shortBigNumber } from '../../utils';
import { VaultData, VaultState } from '../../contexts/fraktion';
import React, { FC } from 'react';
import fraktionConfig from '../../contexts/fraktion/config';

interface MainInfoProps {
  fractionsSupplyNum: number;
  lockedPricePerShareNum: number;
  startBid: string;
  winBid: string;
  vaultData: VaultData;
}

export const MainInfo: FC<MainInfoProps> = ({
  fractionsSupplyNum,
  lockedPricePerShareNum,
  startBid,
  winBid,
  vaultData,
}) => {
  const currency =
    vaultData.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  return (
    <div className={styles.stats}>
      <div className={styles.item}>
        <div className={styles.title}>Total supply</div>
        <div className={styles.value}>
          {fractionsSupplyNum
            ? shortBigNumber(vaultData.fractionsSupply, 1, 3)
            : 'No value'}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>Fraktion price&nbsp;({currency})</div>
        <div className={styles.value}>
          {lockedPricePerShareNum
            ? shortBigNumber(vaultData.lockedPricePerShare, 6, 6)
            : 'No value'}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>
          {vaultData.state === VaultState.Active && `Start bid (${currency})`}
          {vaultData.state === VaultState.AuctionLive &&
            `Current bid (${currency})`}
          {(vaultData.state === VaultState.AuctionFinished ||
            vaultData.state === VaultState.Archived) &&
            `Winning bid (${currency})`}
        </div>
        <div className={styles.value}>
          {vaultData.state === VaultState.Active ? startBid : winBid}
        </div>
      </div>
    </div>
  );
};
