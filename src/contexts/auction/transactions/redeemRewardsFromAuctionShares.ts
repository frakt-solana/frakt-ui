import { redeemRewardsFromAuctionShares as redeemRewardsFromAuctionSharesTransaction } from 'fraktionalizer-client-library';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import fraktionConfig from '../../fraktion/config';
import { VaultData } from '../../fraktion';

interface RedeemRewardsFromAuctionSharesParams {
  vaultInfo: VaultData;
}

interface RedeemRewardsFromAuctionSharesRawParams
  extends RedeemRewardsFromAuctionSharesParams,
    WalletAndConnection {}

export const rawRedeemRewardsFromAuctionShares = async ({
  wallet,
  connection,
  vaultInfo,
}: RedeemRewardsFromAuctionSharesRawParams): Promise<void> => {
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
        wallet,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rawRedeemRewardsFromAuctionShares,
  {
    onSuccessMessage: {
      message: 'Redeemed SOL successfull',
    },
    onErrorMessage: { message: 'Transaction failed' },
  },
);

export const redeemRewardsFromAuctionShares = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
