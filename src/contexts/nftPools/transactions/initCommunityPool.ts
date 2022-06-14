import { pools, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

import {
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';

export const rawInitCommunityPool = async ({
  connection,
  wallet,
}: WalletAndConnection): Promise<void> => {
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
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawInitCommunityPool, {
  onErrorMessage: { message: 'Transaction failed' },
});

export const createCommunityPool = wrappedAsyncWithTryCatch;
