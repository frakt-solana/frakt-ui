import { PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { pools } from '@frakt-protocol/frakt-sdk';

import {
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
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
  await pools.activateCommunityPool({
    communityPool: new PublicKey(communityPoolAddress),
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
};

export const activateCommunityPoolTransaction = wrapTxnWithTryCatch(
  rawActivateCommunityPool,
  {
    onErrorMessage: { message: 'Transaction failed' },
  },
);
