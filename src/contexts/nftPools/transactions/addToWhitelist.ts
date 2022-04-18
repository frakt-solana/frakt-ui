import { PublicKey } from '@solana/web3.js';
import {
  addToWhitelist,
  Provider,
} from '@frakters/community-pools-client-library-v2';

import {
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';

export interface AddToWhiteListTransactionParams {
  communityPoolAddress: string;
  whitelistedAddress: string;
}

export interface AddToWhiteListTransactionRawParams
  extends AddToWhiteListTransactionParams,
    WalletAndConnection {}

const rawAddToWhitelist = async ({
  connection,
  wallet,
  communityPoolAddress,
  whitelistedAddress,
}: AddToWhiteListTransactionRawParams): Promise<void> => {
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
};

export const addToWhitelistTransaction = wrapTxnWithTryCatch(
  rawAddToWhitelist,
  {
    onErrorMessage: { message: 'Transaction failed' },
  },
);
