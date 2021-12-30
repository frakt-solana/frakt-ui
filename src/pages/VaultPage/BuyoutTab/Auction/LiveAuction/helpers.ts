import moment from 'moment';
import { VaultData } from '../../../../../contexts/fraktion';
import { ENDING_PHASE_DURATION } from './constants';

const getTickSize = (vaultInfo: VaultData): number => {
  const winningBidPubKey = vaultInfo.auction.auction.currentWinningBidPubkey;
  const winningBid = vaultInfo.auction.bids.find(
    (el) => (el as any).bidPubkey === winningBidPubKey,
  );
  const supply = vaultInfo.fractionsSupply.toNumber();

  const tickSize =
    vaultInfo.auction.auction.endingAt - moment().unix() > ENDING_PHASE_DURATION
      ? vaultInfo.auction.auction.tickSize.toNumber()
      : (winningBid.bidAmountPerShare.toNumber() / 50) * supply;

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
