import { redeemRewardsFromAuctionShares as redeemRewardsFromAuctionSharesTransaction } from 'fraktionalizer-client-library';

import { signAndConfirmTransaction } from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import fraktionConfig from '../../fraktion/config';
import {
  RedeemRewardsFromAuctionSharesParams,
  WrapperActionTransactionParams,
  WrapperActionTransactionType,
} from '../auction.model';

export const rowRedeemRewardsFromAuctionShares = async ({
  wallet,
  connection,
  vaultInfo,
}: RedeemRewardsFromAuctionSharesParams): Promise<void> => {
  await redeemRewardsFromAuctionSharesTransaction({
    connection,
    userPubkey: wallet.publicKey.toString(),
    vault: vaultInfo.vaultPubkey,
    winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
    auction: vaultInfo.auction.auction.auctionPubkey,
    redeemTreasury: vaultInfo.redeemTreasury,
    fractionMint: vaultInfo.fractionMint,
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

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rowRedeemRewardsFromAuctionShares,
  {
    onSuccessMessage: 'Redeemed SOL successfull',
    onErrorMessage: 'Transaction failed',
  },
);

export const redeemRewardsFromAuctionShares =
  ({ wallet, connection }: WrapperActionTransactionParams) =>
  (
    params: Omit<
      RedeemRewardsFromAuctionSharesParams,
      WrapperActionTransactionType
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      wallet,
      ...params,
    });
