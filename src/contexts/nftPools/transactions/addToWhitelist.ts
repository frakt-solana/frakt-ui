import { pools, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

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
};

export const addToWhitelistTransaction = wrapTxnWithTryCatch(
  rawAddToWhitelist,
  {
    onErrorMessage: { message: 'Transaction failed' },
  },
);
