import { FC, useState } from 'react';
import { PendingAuction } from './PendingAuction';
import { ActiveAuction } from './ActiveAuction';
import { FinishedAuction } from './FinishedAuction';

enum AuctionState {
  pending,
  active,
  finished,
}

export const Auction: FC = () => {
  const [auctionState, setAuctionState] = useState<AuctionState>(
    AuctionState.pending,
  );
  return (
    <div>
      {auctionState === AuctionState.pending && (
        <PendingAuction
          startAuction={() => setAuctionState(AuctionState.active)}
        />
      )}
      {auctionState === AuctionState.active && (
        <ActiveAuction
          finishAuction={() => setAuctionState(AuctionState.finished)}
        />
      )}
      {auctionState === AuctionState.finished && <FinishedAuction />}
    </div>
  );
};
