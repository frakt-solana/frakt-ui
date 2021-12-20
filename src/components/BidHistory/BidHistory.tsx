import React from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { shortenAddress } from '../../utils/solanaUtils';
import { decimalBNToString } from '../../utils';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface BidHistoryTypes {
  bidder: string;
  bidAmountPerShare: BN;
  isCanceled: boolean;
  bidPubkey: string;
}

interface BidHistoryProps {
  bids: BidHistoryTypes[];
  className?: string;
}

export const BidHistory = ({
  bids,
  className,
}: BidHistoryProps): JSX.Element => {
  const wallet = useWallet();

  const sortedBids = bids.sort((a, b) => {
    return b.bidAmountPerShare.cmp(a.bidAmountPerShare);
  });

  const isNotWin = false;

  return (
    <ul className={classNames(className, styles.bid)}>
      {sortedBids.map((bid, index) => (
        <li className={styles.item} key={bid.bidPubkey}>
          <span className={styles.number}>{index + 1}</span>
          <span className={styles.bidder}>{shortenAddress(bid.bidder)}</span>
          {wallet?.publicKey?.toString() === bid.bidder &&
            bid.isCanceled &&
            isNotWin && <button className={styles.refund}>Refund bid</button>}
          <p className={styles.price}>
            {decimalBNToString(bid.bidAmountPerShare)}
            <span className={styles.solanaCurrency}>SOL</span>
          </p>
        </li>
      ))}
    </ul>
  );
};
