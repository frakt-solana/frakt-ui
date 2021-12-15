import React from 'react';
import styles from './styles.module.scss';

interface BidHistoryTypes {
  key: string;
  auction: string;
  bidder: string;
  bid_amount_per_share: number;
  placed_at: string;
  is_canceled: boolean;
}

interface BidHistoryProps {
  bids?: BidHistoryTypes[];
}

const initialBidsForTests = [
  {
    key: 'FTyi...MMzT',
    auction: 'string',
    bidder: 'string',
    bid_amount_per_share: 9,
    placed_at: 'string',
    is_canceled: false,
  },
  {
    key: 'FTyi...MMzT',
    auction: 'string',
    bidder: 'string',
    bid_amount_per_share: 8,
    placed_at: 'string',
    is_canceled: true,
  },
  {
    key: 'FTyi...MMzT',
    auction: 'string',
    bidder: 'string',
    bid_amount_per_share: 7,
    placed_at: 'string',
    is_canceled: true,
  },
  {
    key: 'FTyi...MMzT',
    auction: 'string',
    bidder: 'string',
    bid_amount_per_share: 6,
    placed_at: 'string',
    is_canceled: true,
  },
  {
    key: 'FTyi...MMzT',
    auction: 'string',
    bidder: 'string',
    bid_amount_per_share: 5,
    placed_at: 'string',
    is_canceled: false,
  },
  {
    key: 'FTyi...MMzT',
    auction: 'string',
    bidder: 'string',
    bid_amount_per_share: 3,
    placed_at: 'string',
    is_canceled: true,
  },
] as BidHistoryTypes[];

export const BidHistory = ({
  bids = initialBidsForTests,
}: BidHistoryProps): JSX.Element => {
  return (
    <ul className={styles.bid}>
      {bids.map((bid, index) => (
        <li className={styles.bid__item} key={bid.key}>
          <span className={styles.bid__number}>{index + 1}</span>
          <span className={styles.bid__key}>{bid.key}</span>
          <span className={styles.bid__price}>{bid.bid_amount_per_share}</span>
          <button className={styles.bid__refund}>Refund bid</button>
        </li>
      ))}
    </ul>
  );
};
