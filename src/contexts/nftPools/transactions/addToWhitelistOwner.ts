import { PublicKey } from '@solana/web3.js';
import {
  addToWhitelist,
  Provider,
} from '@frakters/community-pools-client-library-v2';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../../../utils/transactions';
import { AddToWhiteListTransactionRawParams } from './index';
import { notify } from '../../../utils';
import { captureSentryError } from '../../../utils/sentry';
import { NotifyType } from '../../../utils/solanaUtils';

export const addToWhitelistOwner = async ({
  communityPoolAddress,
  whitelistedAddress,
  connection,
  wallet,
}: AddToWhiteListTransactionRawParams): Promise<void> => {
  try {
    await addToWhitelist(
      {
        isCreator: true,
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
      wallet,
      transactionName: 'addToWhitelistOwner',
    });
  }
};
