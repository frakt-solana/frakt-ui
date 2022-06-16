import { PublicKey } from '@solana/web3.js';
import {
  addToWhitelist,
  Provider,
} from '@frakters/community-pools-client-library-v2';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import { captureSentryError } from '../../../utils/sentry';

export interface AddToWhiteListTransactionParams {
  communityPoolAddress: string;
  whitelistedAddress: string;
}

export interface AddToWhiteListTransactionRawParams
  extends AddToWhiteListTransactionParams,
    WalletAndConnection {}

export const addToWhitelistTransaction = async ({
  connection,
  wallet,
  communityPoolAddress,
  whitelistedAddress,
}: AddToWhiteListTransactionRawParams): Promise<void> => {
  try {
    await addToWhitelist(
      {
        isCreator: false,
        communityPool: new PublicKey(communityPoolAddress),
        whitelistedAddress: new PublicKey(whitelistedAddress),
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
      transactionName: 'addToWhitelist',
    });
  }
};
