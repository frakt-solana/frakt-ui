import { withdrawNFTFromCombinedBacket as redeemNftTransaction } from 'fraktionalizer-client-library';

import { signAndConfirmTransaction } from '../../../utils/transactions';
import { wrapAsyncWithTryCatch } from '../../../utils';
import fraktionConfig from '../../fraktion/config';
import {
  RedeemNftParams,
  WrapperActionTransactionType,
} from '../auction.model';

export const rowRedeemNft = async ({
  vaultInfo,
  safetyBoxOrder,
  wallet,
  connection,
}: RedeemNftParams): Promise<void> => {
  const { vaultPubkey, tokenTypeCount, safetyBoxes, fractionMint } = vaultInfo;

  if (tokenTypeCount < 1 || safetyBoxOrder < 0) {
    throw new Error('No NFTs to redeem');
  }

  const safetyBoxToRedeem = safetyBoxes.find(
    ({ order }) => order === safetyBoxOrder,
  );

  await redeemNftTransaction(
    connection,
    wallet.publicKey.toBase58(),
    vaultPubkey,
    [safetyBoxToRedeem.safetyBoxPubkey],
    [safetyBoxToRedeem.nftMint],
    [safetyBoxToRedeem.store],
    fractionMint,
    fraktionConfig.PROGRAM_PUBKEY,
    async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        walletPublicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
      });
    },
  );
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowRedeemNft, {
  onSuccessMessage: 'NFT redeemed successfully',
});

export const redeemNft =
  ({ wallet, connection }: RedeemNftParams) =>
  (
    params: Omit<RedeemNftParams, WrapperActionTransactionType>,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      wallet,
      ...params,
    });
