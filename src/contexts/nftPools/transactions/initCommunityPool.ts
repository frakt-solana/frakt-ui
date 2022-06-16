import { PublicKey } from '@solana/web3.js';
import { initCommunityPool } from '@frakters/community-pools-client-library-v2';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import { Provider } from '@project-serum/anchor';
import { notify } from '../../../utils';
import { captureSentryError } from '../../../utils/sentry';
import { NotifyType } from '../../../utils/solanaUtils';

export const createCommunityPool = async ({
  connection,
  wallet,
}: WalletAndConnection): Promise<void> => {
  try {
    await initCommunityPool({
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
