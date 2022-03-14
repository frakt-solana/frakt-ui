import { PublicKey } from '@solana/web3.js';
import {
  depositNftToCommunityPool as depositNftToCommunityPoolTxn,
  Provider,
} from '@frakters/community-pools-client-library-v2';
import { deriveMetadataPubkeyFromMint } from '@frakters/community-pools-client-library-v2/lib/utils/utils';

import { NftPoolData } from './../../../utils/cacher/nftPools';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../utils/transactions';

import { getTokenAccount } from '../../../utils/accounts';
import { wrapAsyncWithTryCatch } from '../../../utils';

export interface DepositNftToCommunityPoolParams {
  pool: NftPoolData;
  nftMint: PublicKey;
  byCreator?: boolean;
  afterTransaction?: () => void;
}

export interface DepositNftToCommunityPoolRawParams
  extends DepositNftToCommunityPoolParams,
    WalletAndConnection {}

export const rawDepositNftToCommunityPool = async ({
  connection,
  wallet,
  pool,
  nftMint,
  byCreator = false,
  afterTransaction,
}: DepositNftToCommunityPoolRawParams): Promise<void> => {
  const { publicKey: nftUserTokenAccount } = await getTokenAccount({
    tokenMint: nftMint,
    owner: wallet.publicKey,
    connection,
  });

  const metadataInfo = byCreator
    ? await deriveMetadataPubkeyFromMint(nftMint)
    : nftMint;

  const poolWhitelist = pool.poolWhitelist.find(
    ({ whitelistedAddress }) =>
      whitelistedAddress.toBase58() === nftMint.toBase58(),
  ); //! Add condition for creator
  //TODO

  await depositNftToCommunityPoolTxn(
    {
      nftMint: nftMint,
      communityPool: pool.publicKey,
      poolWhitelist: poolWhitelist.publicKey,
      nftUserTokenAccount,
      fractionMint: pool.fractionMint,
      metadataInfo,
      fusionProgramId: new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      tokenMintInputFusion: new PublicKey(
        'C56Dq4P8kYpzt984PNBgQPb4v7vDdTaMNtucNYz9iSzT',
      ),
      leaderboardProgramId: new PublicKey(
        process.env.LEADERBOARD_PROGRAM_PUBKEY,
      ),
      replaceTokenMintInput: new PublicKey(
        'C56Dq4P8kYpzt984PNBgQPb4v7vDdTaMNtucNYz9iSzT',
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
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rawDepositNftToCommunityPool,
  {
    onSuccessMessage: 'NFT deposited successfully',
    onErrorMessage: 'NFT depositing failed',
  },
);

export const depositNftToCommunityPool = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
