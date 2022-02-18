import styles from './styles.module.scss';
import { shortBigNumber } from '../../utils';
import {
  useAuctionCountdown,
  VaultData,
  VaultState,
} from '../../contexts/fraktion';
import React, { FC } from 'react';
import fraktionConfig from '../../contexts/fraktion/config';

interface AuctionInfoProps {
  fractionsSupplyNum: number;
  lockedPricePerShareNum: number;
  startBid: string;
  winBid: string;
  vaultData: VaultData;
}

export const AuctionInfo: FC<AuctionInfoProps> = ({
  fractionsSupplyNum,
  lockedPricePerShareNum,
  startBid,
  winBid,
  vaultData,
}) => {
  const auctionEndingTime = vaultData?.auction?.auction?.isStarted
    ? vaultData?.auction?.auction?.endingAt
    : 0;

  const { leftTime } = useAuctionCountdown(auctionEndingTime);

  return (
    <div className={styles.stats}>
      <div className={styles.item}>
        <div className={styles.title}>
          TIME <br /> LEFT
        </div>
        <div className={styles.value}>
          {fractionsSupplyNum ? (
            <div className={styles.countdown}>
              <p className={styles.timeItem}>{leftTime.days}d</p>
              <span className={styles.timeDelim}>:</span>
              <p className={styles.timeItem}>{leftTime.hours}h</p>
              <span className={styles.timeDelim}>:</span>
              <p className={styles.timeItem}>{leftTime.minutes}m</p>
              <span className={styles.timeDelim}>:</span>
              <p className={styles.timeItem}>{leftTime.seconds}s</p>
            </div>
          ) : (
            'No value'
          )}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>LAST&nbsp;BID (SOL)</div>
        <div className={styles.value}>
          {lockedPricePerShareNum ? winBid : 'No value'}
        </div>
      </div>
    </div>
  );
};
