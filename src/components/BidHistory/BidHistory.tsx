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
  refundBid: (bidPubKey: string) => Promise<boolean>;
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

  const refundBidClick = (bid: Bid) => async () => {
    try {
      setIsRefunding(true);
      const responce = await refundBid(bid.bidPubkey);
      if (responce) {
        setRefundedBids((refundedBids) => [...refundedBids, bid.bidPubkey]);
      }
      setIsRefunding(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsRefunding(false);
    }
  };

  const ownBids = bids.filter((bid) => isRefundAvailable(bid));

  const onRefundAllBidsClick = async () => {
    try {
      setIsRefunding(true);
      for (let i = 0; i < ownBids.length; i++) {
        const bidPubkey = ownBids[i].bidPubkey;
        const responce = await refundBid(bidPubkey);
        if (responce) {
          setRefundedBids((refundedBids) => [...refundedBids, bidPubkey]);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsRefunding(false);
    }
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
