import { refundBid as refundBidTransaction } from '@frakters/fraktionalizer-client-library';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import { signAndConfirmTransaction } from '../../../utils/transactions';
import { VaultData } from '../../fraktion';
import fraktionConfig from '../../fraktion/config';

export const refundBid =
  (wallet: WalletContextState, connection: Connection) =>
  async (vaultInfo: VaultData, bid: string): Promise<boolean> => {
    try {
      await refundBidTransaction({
        connection,
        bid,
        userPubkey: wallet.publicKey.toString(),
        vault: vaultInfo.vaultPubkey,
        auction: vaultInfo.auction.auction.auctionPubkey,
        fractionTreasury: vaultInfo.fractionTreasury,
        redeemTreasury: vaultInfo.redeemTreasury,
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
      notify({
        message: 'Bid refunded successfully',
        type: NotifyType.SUCCESS,
      });
      return true;
    } catch (error) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  };
