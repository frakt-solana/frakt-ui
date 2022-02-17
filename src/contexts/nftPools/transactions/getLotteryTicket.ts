import { PublicKey } from '@solana/web3.js';
import {
  getLotteryTicket as getLotteryTicketTxn,
  Provider,
} from 'community-pools-client-library-v2';

import { NftPoolData } from './../../../utils/cacher/nftPools';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';

import { getTokenAccount } from '../../../utils/accounts';
import { wrapAsyncWithTryCatch } from '../../../utils';

export interface GetLotteryTicketParams {
  pool: NftPoolData;
  afterTransaction?: () => void;
}

export interface GetLotteryTicketRawParams
  extends GetLotteryTicketParams,
    WalletAndConnection {}

const rawGetLotteryTicket = async ({
  connection,
  wallet,
  pool,
  afterTransaction,
}: GetLotteryTicketRawParams): Promise<PublicKey> => {
  const { publicKey: userFractionsTokenAccount } = await getTokenAccount({
    tokenMint: pool.fractionMint,
    owner: wallet.publicKey,
    connection,
  });

  const { lotteryTicketPubkey } = await getLotteryTicketTxn(
    {
      communityPool: pool.publicKey,
      userFractionsTokenAccount,
      fractionMint: pool.fractionMint,
    },
    {
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
    },
  );

  afterTransaction && afterTransaction();

  return lotteryTicketPubkey;
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawGetLotteryTicket, {
  onErrorMessage: 'Transaction failed',
});

export const getLotteryTicket = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
