import { web3, pools, AnchorProvider } from '@frakt-protocol/frakt-sdk';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import { captureSentryError } from '../../../utils/sentry';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';

export interface ActivateCommunityPoolTransactionParams {
  communityPoolAddress: string;
}

export interface ActivateCommunityPoolTransactionRawParams
  extends ActivateCommunityPoolTransactionParams,
    WalletAndConnection {}

export const activateCommunityPoolTransaction = async ({
  connection,
  wallet,
  communityPoolAddress,
}: ActivateCommunityPoolTransactionRawParams): Promise<void> => {
  try {
    await pools.activateCommunityPool({
      communityPool: new web3.PublicKey(communityPoolAddress),
      programId: new web3.PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
      userPubkey: wallet.publicKey,
      provider: new AnchorProvider(connection, wallet, null),
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          signers,
        });
      },
    });
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'activateCommunityPool',
    });
  }
};
