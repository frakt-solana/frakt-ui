import moment from 'moment';
import { VaultData } from '../../../../../contexts/fraktion';
import { REGULAR_PHASE_DURATION } from './constants';

const getTickSize = (vaultInfo: VaultData): number => {
  const winningBidPubKey = vaultInfo.auction.auction.currentWinningBidPubkey;
  const winningBid = vaultInfo.auction.bids.find(
    (el) => (el as any).bidPubkey === winningBidPubKey,
  );
  const supply = vaultInfo.fractionsSupply.toNumber();

  const isEndingPhase =
    vaultInfo.auction.auction.startedAt + REGULAR_PHASE_DURATION <
    moment().unix();

  const tickSize = isEndingPhase
    ? (winningBid.bidAmountPerShare.toNumber() / 50) * supply
    : vaultInfo.auction.auction.tickSize.toNumber();

  return tickSize;
};

export const calculateMinBid = (vaultInfo: VaultData): number => {
  const winningBidPubKey = vaultInfo.auction.auction.currentWinningBidPubkey;
  const winningBid = vaultInfo.auction.bids.find(
    (el) => (el as any).bidPubkey === winningBidPubKey,
  );
  const supply = vaultInfo.fractionsSupply.toNumber();

  const tickSize = getTickSize(vaultInfo);
  const realTickSize = tickSize > 1e9 ? tickSize : 1e9;

  const nextBidAmount =
    winningBid.bidAmountPerShare.toNumber() * supply + realTickSize;

  const minPerShare = Math.ceil(nextBidAmount / supply);
  return (minPerShare * supply) / 1e9;
};
