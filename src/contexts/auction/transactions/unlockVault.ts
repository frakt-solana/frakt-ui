import { unlockBacketAfterBuyoutAuction as unlockVaultTransaction } from 'fraktionalizer-client-library';

import { signAndConfirmTransaction } from '../../../utils/transactions';
import fraktionConfig from '../../fraktion/config';
import { wrapAsyncWithTryCatch } from '../../../utils';
import { UnlockVaultParams } from '../auction.model';

export const rowUnlockVault = async ({
  vaultInfo,
  wallet,
  connection,
}: UnlockVaultParams): Promise<void> => {
  await unlockVaultTransaction({
    auction: vaultInfo.auction.auction.auctionPubkey,
    winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
    userPubkey: wallet.publicKey.toBase58(),
    adminPubkey: fraktionConfig.ADMIN_PUBKEY,
    vault: vaultInfo.vaultPubkey,
    fractionMint: vaultInfo.fractionMint,
    vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
    sendTxn: async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        walletPublicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowUnlockVault, {
  onSuccessMessage: 'Vault unlocked successfully',
});

export const unlockVault = ({
  wallet,
  connection,
  vaultInfo,
}: UnlockVaultParams): Promise<void> =>
  wrappedAsyncWithTryCatch({
    connection,
    wallet,
    vaultInfo,
  });
