import { pools, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

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
    communityPool: new web3.PublicKey(communityPoolAddress),
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
};

export const activateCommunityPoolTransaction = wrapTxnWithTryCatch(
  rawActivateCommunityPool,
  {
    onErrorMessage: { message: 'Transaction failed' },
  },
);
