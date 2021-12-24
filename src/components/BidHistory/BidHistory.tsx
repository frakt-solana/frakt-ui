import React, { useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { shortenAddress } from '../../utils/solanaUtils';
import { decimalBNToString } from '../../utils';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface Bid {
  bidder: string;
  bidAmountPerShare: BN;
  isCanceled: boolean;
  bidPubkey: string;
}

interface BidHistoryProps {
  bids: Bid[];
  className?: string;
  supply: BN;
  winningBidPubKey?: string;
  refundBid: (string) => Promise<boolean>;
}

export const BidHistory = ({
  bids,
  className,
  supply,
  winningBidPubKey,
  refundBid,
}: BidHistoryProps): JSX.Element => {
  const [refundedBids, setRefundedBids] = useState<string[]>([]);
  const [isRefunding, setIsRefunding] = useState<boolean>(false);
  const wallet = useWallet();

  const sortedBids = bids.sort((a, b) => {
    return b.bidAmountPerShare.cmp(a.bidAmountPerShare);
  });

  const isRefundAvailable = (bid: Bid) => {
    const isBidYours = wallet?.publicKey?.toString() === bid.bidder;
    const isCanceled = bid.isCanceled;
    const isBidWins = bid.bidPubkey === winningBidPubKey;
    const isRefunded = refundedBids.find((key) => bid.bidPubkey === key);
    return (
      isBidYours && !isCanceled && !isBidWins && !isRefunded && !isRefunding
    );
  };

  const refundBidClick = (bid: Bid) => () => {
    setIsRefunding(true);
    setRefundedBids([...refundedBids, bid.bidPubkey]);
    refundBid(bid.bidPubkey)
      .then((result) => {
        if (!result) {
          setRefundedBids(
            refundedBids.filter((bidKey) => bidKey !== bid.bidPubkey),
          );
        }
      })
      .finally(() => {
        setIsRefunding(false);
      });
  };

  const ownBids = bids.filter((bid) => isRefundAvailable(bid));

  const refundOneBid = (bid: Bid) => {
    refundBid(bid.bidPubkey);
  };

  const onRefundAllBidsClick = async () => {
    setIsRefunding(true);
    const series = async () => {
      for (let i = 0; i < ownBids.length; i++) {
        setRefundedBids([...refundedBids, ownBids[i].bidPubkey]);
        const res = await refundBid(ownBids[i].bidPubkey);
        if (!res) {
          setRefundedBids(
            refundedBids.filter((bidKey) => bidKey !== ownBids[i].bidPubkey),
          );
        }
      }
    };
    await series();
    setIsRefunding(false);
  };

  return (
    <>
      <ul className={classNames(className, styles.bid)}>
        {sortedBids.map((bid, index) => (
          <li className={styles.item} key={bid.bidPubkey}>
            <span className={styles.number}>{index + 1}</span>
            <span className={styles.bidder}>{shortenAddress(bid.bidder)}</span>
            {isRefundAvailable(bid) && (
              <button onClick={refundBidClick(bid)} className={styles.refund}>
                Refund bid
              </button>
            )}
            <p className={styles.price}>
              {decimalBNToString(bid.bidAmountPerShare.mul(supply))}
              <span className={styles.solanaCurrency}>SOL</span>
            </p>
          </li>
        ))}
      </ul>
      {!!ownBids.length && (
        <button
          className={styles.refundPossibleBtn}
          onClick={onRefundAllBidsClick}
        >
          Refund possible bids
        </button>
      )}
    </>
  );
};
