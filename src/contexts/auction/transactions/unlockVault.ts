import { unlockBacketAfterBuyoutAuction as unlockVaultTransaction } from 'fraktionalizer-client-library';

import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import fraktionConfig from '../../fraktion/config';
import { wrapAsyncWithTryCatch } from '../../../utils';
import { VaultData } from '../../fraktion';

interface UnlockVaultParams extends WalletAndConnection {
  vaultInfo: VaultData;
}

export const rawUnlockVault = async ({
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
        wallet,
      });
    },
  });
};

export const unlockVault = wrapAsyncWithTryCatch(rawUnlockVault, {
  onSuccessMessage: {
    message: 'Vault unlocked successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});
