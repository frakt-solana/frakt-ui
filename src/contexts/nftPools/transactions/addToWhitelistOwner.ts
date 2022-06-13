import { PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { pools } from '@frakt-protocol/frakt-sdk';

import {
  signAndConfirmTransaction,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { AddToWhiteListTransactionRawParams } from './index';

const rawAddToWhitelistOwner = async ({
  communityPoolAddress,
  whitelistedAddress,
  connection,
  wallet,
}: AddToWhiteListTransactionRawParams): Promise<void> => {
  await pools.addToWhitelist({
    isCreator: true,
    communityPool: new PublicKey(communityPoolAddress),
    whitelistedAddress: new PublicKey(whitelistedAddress),
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

export const addToWhitelistOwner = wrapTxnWithTryCatch(rawAddToWhitelistOwner, {
  onErrorMessage: { message: 'Transaction failed' },
});
