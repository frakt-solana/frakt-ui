import { PublicKey } from '@solana/web3.js';
import {
  depositNftToCommunityPool as depositNftToCommunityPoolTxn,
  Provider,
} from 'community-pools-client-library-v2';
import { deriveMetadataPubkeyFromMint } from 'community-pools-client-library-v2/lib/utils/utils';

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
}

export interface DepositNftToCommunityPoolRawParams
  extends DepositNftToCommunityPoolParams,
    WalletAndConnection {}

const rawDepositNftToCommunityPool = async ({
  connection,
  wallet,
  pool,
  nftMint,
  byCreator = false,
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

  await depositNftToCommunityPoolTxn(
    {
      nftMint: nftMint,
      communityPool: pool.publicKey,
      poolWhitelist: poolWhitelist.publicKey,
      nftUserTokenAccount,
      fractionMint: pool.fractionMint,
      metadataInfo,
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
