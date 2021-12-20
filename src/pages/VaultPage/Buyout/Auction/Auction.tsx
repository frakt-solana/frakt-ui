import { FC, useEffect, useState } from 'react';
import { PendingAuction } from './PendingAuction';
import { ActiveAuction } from './ActiveAuction';
import { FinishedAuction } from './FinishedAuction';
import { VaultData, VaultState } from '../../../../contexts/fraktion';

enum AuctionState {
  pending,
  active,
  finished,
}

interface AuctionProps {
  vaultInfo: VaultData;
}

export const Auction: FC<AuctionProps> = ({ vaultInfo }) => {
  const [auctionState, setAuctionState] = useState<AuctionState>(null);

  useEffect(() => {
    if (
      vaultInfo.state === VaultState.Active &&
      !vaultInfo.auction.auction.isStarted
    )
      setAuctionState(AuctionState.pending);
    if (
      vaultInfo.state === VaultState.Auction &&
      vaultInfo.auction.auction.isStarted
    )
      setAuctionState(AuctionState.active);
  }, [vaultInfo]);

  if (auctionState === null) return null;

  return (
    <div>
      {auctionState === AuctionState.pending && (
        <PendingAuction
          vaultInfo={vaultInfo}
          startAuction={() => setAuctionState(AuctionState.active)}
        />
      )}
      {auctionState === AuctionState.active && (
        <ActiveAuction vaultInfo={vaultInfo} />
      )}
      {auctionState === AuctionState.finished && <FinishedAuction />}
    </div>
  );
};
