import { PublicKey } from '@solana/web3.js';
import { initCommunityPool } from 'community-pools-client-library-v2';

import { wrapAsyncWithTryCatch } from '../../../utils';
import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';
import { Provider } from '@project-serum/anchor';

export const rawInitCommunityPool = async ({
  connection,
  wallet,
}: WalletAndConnection): Promise<void> => {
  await initCommunityPool({
    programId: new PublicKey(process.env.REACT_APP_COMMUNITY_POOLS_PUBKEY),
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

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawInitCommunityPool, {
  onErrorMessage: 'Error',
});

export const createCommunityPool = wrappedAsyncWithTryCatch;
