import { FC, useEffect, useState } from 'react';
import { ActiveAuction } from './ActiveAuction';
import { LiveAuction } from './LiveAuction';
import { FinishedAuction } from './FinishedAuction';
import { VaultData, VaultState } from '../../../../contexts/fraktion';
import moment from 'moment';

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
  const endTimeMoment = moment.unix(vaultInfo?.auction?.auction?.endingAt);
  const timeDifference = moment.duration(endTimeMoment?.diff(moment()));

  // TODO check null
  //vaultInfo.auction = (null as any)
  useEffect(() => {
    if (
      vaultInfo.state === VaultState.Active &&
      !vaultInfo?.auction?.auction?.isStarted
    ) {
      setAuctionState(AuctionState.pending);
    } else if (
      vaultInfo.state === VaultState.AuctionLive &&
      vaultInfo?.auction?.auction?.isStarted &&
      timeDifference.asSeconds() > 0
    ) {
      setAuctionState(AuctionState.active);
    } else {
      setAuctionState(AuctionState.finished);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultInfo]);

  if (auctionState === null) return null;

  return (
    <div>
      {auctionState === AuctionState.pending && (
        <ActiveAuction vaultInfo={vaultInfo} />
      )}
      {auctionState === AuctionState.active && (
        <LiveAuction vaultInfo={vaultInfo} />
      )}
      {auctionState === AuctionState.finished && (
        <FinishedAuction vaultInfo={vaultInfo} />
      )}
    </div>
  );
};
