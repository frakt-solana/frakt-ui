import { PublicKey } from '@solana/web3.js';
import {
  activateCommunityPool,
  Provider,
} from '@frakters/community-pools-client-library-v2';

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
    await activateCommunityPool(
      {
        communityPool: new PublicKey(communityPoolAddress),
      },
      {
        programId: new PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
        userPubkey: wallet.publicKey,
        provider: new Provider(connection, wallet, null),
        sendTxn: async (transaction, signers) => {
          await signAndConfirmTransaction({
            transaction,
            connection,
            wallet,
            signers,
          });
        },
      },
    );
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
      user: wallet?.publicKey?.toBase58(),
      transactionName: 'activateCommunityPool',
    });
  }
};
