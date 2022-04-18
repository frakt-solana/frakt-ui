import { withdrawNFTFromCombinedBacket as redeemNftTransaction } from '@frakters/fraktionalizer-client-library';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import fraktionConfig from '../../fraktion/config';
import { VaultData } from '../../fraktion';

interface RedeemNftParams {
  vaultInfo: VaultData;
  safetyBoxOrder: number;
}

interface RedeemNftRawParams extends WalletAndConnection, RedeemNftParams {}

export const rawRedeemNft = async ({
  vaultInfo,
  safetyBoxOrder,
  wallet,
  connection,
}: RedeemNftRawParams): Promise<void> => {
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
        wallet,
      });
    },
  );
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawRedeemNft, {
  onSuccessMessage: {
    message: 'NFT redeemed successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const redeemNft = createTransactionFuncFromRaw(wrappedAsyncWithTryCatch);
