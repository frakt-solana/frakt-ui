import { pools, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

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
};

export const addToWhitelistOwner = wrapTxnWithTryCatch(rawAddToWhitelistOwner, {
  onErrorMessage: { message: 'Transaction failed' },
});
