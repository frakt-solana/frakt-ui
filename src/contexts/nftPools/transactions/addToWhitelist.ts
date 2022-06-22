import { pools, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

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
    await pools.addToWhitelist({
      isCreator: false,
      communityPool: new web3.PublicKey(communityPoolAddress),
      whitelistedAddress: new web3.PublicKey(whitelistedAddress),
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

    captureSentryError({ error, wallet, transactionName: 'addToWhitelist' });
  }
};
