import React from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { shortenAddress } from '../../utils/solanaUtils';
import { decimalBNToString } from '../../utils';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface BidHistoryTypes {
  key: string;
  bidder: string;
  bid_amount_per_share: BN;
}

interface BidHistoryProps {
  bids?: BidHistoryTypes[];
  className?: string;
}

const initialBidsForTests = [
  {
    key: 'bidKeyForMapID11',
    bidder: 'oY1PrgFjdKXJtSxaGFTyiPfykRvpcGpqsDFqLWVcNHrZPrVdw',
    bid_amount_per_share: new BN(7e9),
  },
  {
    key: 'bidKeyForMapID12',
    bidder: 'EQ5XjC1neq4FbqLUaeHLx48CTougsPYdsFTyiGgti4KqEFUR',
    bid_amount_per_share: new BN(9e9),
  },
  {
    key: 'bidKeyForMapID13',
    bidder: 'Qm4ZEdC4agkXyFTyitbqEQV9pC2k1Z7v2Fv4g9RuoGJr3We',
    bid_amount_per_share: new BN(3e9),
  },
  {
    key: 'bidKeyForMapID14',
    bidder: 'AttVmG6mSVAePkrrW6wWS6DQ5BwSW9qjBti87MRaeN3L',
    bid_amount_per_share: new BN(18e9),
  },
  {
    key: 'bidKeyForMapID15',
    bidder: '3WeuQm4ZEdC4agkXyFTyitbqEQV9pC2k1Z7v2Fv4g9RuoGJr',
    bid_amount_per_share: new BN(6e9),
  },
  {
    key: 'bidKeyForMapID16',
    bidder: 'AttVmG6mSVAePkrrW6wWS6DQ5BwSW9qjBti87MRaeN3L',
    bid_amount_per_share: new BN(5e9),
  },
] as BidHistoryTypes[];

export const BidHistory = ({
  bids = initialBidsForTests,
  className,
}: BidHistoryProps): JSX.Element => {
  const wallet = useWallet();

  const sortedBids = bids.sort((a, b) => {
    return b.bid_amount_per_share.cmp(a.bid_amount_per_share);
  });

  return (
    <ul className={classNames(className, styles.bid)}>
      {sortedBids.map((bid, index) => (
        <li className={styles.item} key={bid.key}>
          <span className={styles.number}>{index + 1}</span>
          <span className={styles.bidder}>{shortenAddress(bid.bidder)}</span>
          {index !== 0 &&
            wallet.publicKey &&
            wallet.publicKey.toString() === bid.bidder && (
              <button className={styles.refund}>Refund bid</button>
            )}
          <p className={styles.price}>
            <span className={styles.solanaCurrency}>SOL</span>
            {decimalBNToString(bid.bid_amount_per_share)}
          </p>
        </li>
      ))}
    </ul>
  );
};
