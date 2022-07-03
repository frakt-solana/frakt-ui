import { web3, pools } from '@frakt-protocol/frakt-sdk';

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
    await pools.addToWhitelist({
      isCreator: true,
      communityPool: new web3.PublicKey(communityPoolAddress),
      whitelistedAddress: new web3.PublicKey(whitelistedAddress),
      programId: new web3.PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
      userPubkey: wallet.publicKey,
      connection,
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
      transactionName: 'addToWhitelistOwner',
      params: { whitelistedAddress, communityPoolAddress },
    });
  }
};
