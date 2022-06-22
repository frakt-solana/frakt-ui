import { pools, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import { notify } from '../../../utils';
import { captureSentryError } from '../../../utils/sentry';
import { NotifyType } from '../../../utils/solanaUtils';

export const createCommunityPool = async ({
  connection,
  wallet,
}: WalletAndConnection): Promise<void> => {
  try {
    await pools.initCommunityPool({
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
      transactionName: 'createCommunityPool',
    });
  }
};
