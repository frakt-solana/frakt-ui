import { pools, utils, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

import { NftPoolData } from './../../../utils/cacher/nftPools';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';

export interface GetLotteryTicketParams {
  pool: NftPoolData;
  poolLpMint: web3.PublicKey;
  afterTransaction?: () => void;
}

export interface GetLotteryTicketRawParams
  extends GetLotteryTicketParams,
    WalletAndConnection {}

export const rawGetLotteryTicket = async ({
  connection,
  wallet,
  pool,
  poolLpMint,
  afterTransaction,
}: GetLotteryTicketRawParams): Promise<web3.PublicKey> => {
  const { pubkey: userFractionsTokenAccount } = await utils.getTokenAccount({
    tokenMint: pool.fractionMint,
    owner: wallet.publicKey,
    connection,
  });

  const { lotteryTicketPubkey } = await pools.getLotteryTicket({
    communityPool: pool.publicKey,
    userFractionsTokenAccount,
    fractionMint: pool.fractionMint,
    fusionProgramId: new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
    tokenMintInputFusion: poolLpMint,
    feeConfig: new web3.PublicKey(process.env.FEE_CONFIG_GENERAL),
    adminAddress: new web3.PublicKey(process.env.FEE_ADMIN_GENERAL),
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

  afterTransaction && afterTransaction();

  return lotteryTicketPubkey;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawGetLotteryTicket, {
  onSuccessMessage: {
    message: 'Buy made successfully',
    description: 'You will receive your NFT shortly',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const getLotteryTicket = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
