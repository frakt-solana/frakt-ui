import { PublicKey } from '@solana/web3.js';
import {
  getLotteryTicket as getLotteryTicketTxn,
  Provider,
} from '@frakters/community-pools-client-library-v2';

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

export const rawGetLotteryTicket = async ({
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
      fusionProgramId: new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      tokenMintInputFusion: new PublicKey(
        // 'C56Dq4P8kYpzt984PNBgQPb4v7vDdTaMNtucNYz9iSzT',
        'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj',
      ),
      leaderboardProgramId: new PublicKey(
        process.env.LEADERBOARD_PROGRAM_PUBKEY,
      ),
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

  afterTransaction && afterTransaction();

  return lotteryTicketPubkey;
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rawGetLotteryTicket, {
  onErrorMessage: 'Transaction failed',
});

export const getLotteryTicket = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
