import { PublicKey } from '@solana/web3.js';
import { addToWhitelist, Provider } from 'community-pools-client-library-v2';

import { wrapAsyncWithTryCatch } from '../../../utils';
import { signAndConfirmTransaction } from '../../../utils/transactions';
import { AddToWhiteListTransactionRawParams } from './index';

const rawAddToWhitelistOwner = async ({
  communityPoolAddress,
  whitelistedAddress,
  connection,
  wallet,
}: AddToWhiteListTransactionRawParams): Promise<void> => {
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
};

export const addToWhitelistOwner = wrapAsyncWithTryCatch(
  rawAddToWhitelistOwner,
  {
    onErrorMessage: 'Error',
  },
);
