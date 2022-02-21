import styles from './styles.module.scss';
import { useAuctionCountdown, VaultData } from '../../contexts/fraktion';
import React, { FC } from 'react';
import classNames from 'classnames';

interface AuctionInfoProps {
  fractionsSupplyNum: number;
  lockedPricePerShareNum: number;
  winBid: string;
  vaultData: VaultData;
}

export const AuctionInfo: FC<AuctionInfoProps> = ({
  fractionsSupplyNum,
  lockedPricePerShareNum,
  winBid,
  vaultData,
}) => {
  const auctionStartTime = vaultData?.auction?.auction?.startedAt || 0;
  const auctionEndingTime = vaultData?.auction?.auction?.endingAt || 0;
  const today = Date.now() / 1000;

  const sinceTime = today - auctionStartTime;
  const allTime = auctionEndingTime - auctionStartTime;
  const timePercent = String((sinceTime / allTime) * 100).slice(0, 2);

  const { timeLeft } = useAuctionCountdown(auctionEndingTime);

  return (
    <div className={classNames(styles.stats, styles.statsAuction)}>
      <div className={styles.infoWrapper}>
        <div className={styles.item}>
          <div className={styles.title}>
            TIME <br /> LEFT
          </div>
          <div className={styles.value}>
            {fractionsSupplyNum ? (
              <div className={styles.countdown}>
                <p className={styles.timeItem}>{timeLeft.days}d</p>
                <span className={styles.timeDelim}>:</span>
                <p className={styles.timeItem}>{timeLeft.hours}h</p>
                <span className={styles.timeDelim}>:</span>
                <p className={styles.timeItem}>{timeLeft.minutes}m</p>
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
      <div className={styles.timeProgressWrapper}>
        <div
          className={styles.timeProgress}
          style={{ width: `${timePercent}%` }}
        />
      </div>
    </div>
  );
};
