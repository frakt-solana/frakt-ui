import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useFraktion } from './../fraktion/fraktion.hooks';

import {
  bidOnAuction,
  redeemRewardsFromAuctionShares,
  refundBid,
  startFraktionalizerAuction,
  unlockVaultAndRedeemNfts,
  createBuyoutByOwner,
} from './transactions';

//eslint-disable-next-line
export const useAuction = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { patchVault } = useFraktion();
  return {
    startFraktionalizerAuction: startFraktionalizerAuction({
      wallet,
      connection,
    }),
    bidOnAuction: bidOnAuction({ wallet, connection }),
    refundBid: refundBid(wallet, connection),
    redeemRewardsFromAuctionShares: redeemRewardsFromAuctionShares({
      wallet,
      connection,
    }),
    unlockVaultAndRedeemNfts: unlockVaultAndRedeemNfts({
      patchVault,
      wallet,
      connection,
    }),
    createBuyoutByOwner: createBuyoutByOwner({
      wallet,
      connection,
    }),
  };
};
