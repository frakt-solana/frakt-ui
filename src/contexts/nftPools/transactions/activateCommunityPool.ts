import { PublicKey } from '@solana/web3.js';
import {
  activateCommunityPool,
  Provider,
} from 'community-pools-client-library-v2';

import { wrapAsyncWithTryCatch } from '../../../utils';
import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';

export interface ActivateCommunityPoolTransactionParams {
  communityPoolAddress: string;
}

export interface ActivateCommunityPoolTransactionRawParams
  extends ActivateCommunityPoolTransactionParams,
    WalletAndConnection {}

const rawActivateCommunityPool = async ({
  connection,
  wallet,
  communityPoolAddress,
}: ActivateCommunityPoolTransactionRawParams): Promise<void> => {
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
};

export const activateCommunityPoolTransaction = wrapAsyncWithTryCatch(
  rawActivateCommunityPool,
  {
    onErrorMessage: 'Error',
  },
);
