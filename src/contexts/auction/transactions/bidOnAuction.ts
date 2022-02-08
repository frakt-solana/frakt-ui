import { bidOnAuction as bidOnAuctionTransaction } from 'fraktionalizer-client-library';

import { signAndConfirmTransaction } from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import fraktionConfig from '../../fraktion/config';
import {
  BidOnAuctionParams,
  WrapperActionTransactionParams,
  WrapperActionTransactionType,
} from '../auction.model';

export const rowBidOnAuction = async ({
  wallet,
  connection,
  vaultInfo,
  price,
}: BidOnAuctionParams): Promise<void> => {
  const supply = vaultInfo.fractionsSupply.toNumber();
  const perShare = Math.ceil((price * 1e9) / supply);
  const bidCap = perShare * supply;

  await bidOnAuctionTransaction({
    connection,
    winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
    bidPerShare: perShare,
    bidCap,
    adminPubkey: fraktionConfig.ADMIN_PUBKEY,
    userPubkey: wallet.publicKey,
    vault: vaultInfo.vaultPubkey,
    auction: vaultInfo.auction.auction.auctionPubkey,
    fractionMint: vaultInfo.fractionMint,
    fractionTreasury: vaultInfo.fractionTreasury,
    redeemTreasury: vaultInfo.redeemTreasury,
    priceMint: vaultInfo.priceMint,
    vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
    sendTxn: async (transaction, signers) => {
      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        walletPublicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowBidOnAuction, {
  onSuccessMessage: 'Bid placed successfully',
  onErrorMessage: 'Transaction failed',
});

export const bidOnAuction =
  ({ wallet, connection }: WrapperActionTransactionParams) =>
  (
    params: Omit<BidOnAuctionParams, WrapperActionTransactionType>,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      wallet,
      ...params,
    });
