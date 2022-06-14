import { utils, pools, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

import { NftPoolData } from './../../../utils/cacher/nftPools';
import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { UserNFT } from '../../../state/userTokens/types';

export interface DepositNftToCommunityPoolParams {
  pool: NftPoolData;
  nft: UserNFT;
  poolLpMint: web3.PublicKey;
  afterTransaction?: () => void;
}

export interface DepositNftToCommunityPoolRawParams
  extends DepositNftToCommunityPoolParams,
    WalletAndConnection {}

export const rawDepositNftToCommunityPool = async ({
  connection,
  wallet,
  pool,
  nft,
  poolLpMint = new web3.PublicKey(process.env.FRKT_MINT),
  afterTransaction,
}: DepositNftToCommunityPoolRawParams): Promise<boolean | null> => {
  const { pubkey: nftUserTokenAccount } = await utils.getTokenAccount({
    tokenMint: new web3.PublicKey(nft.mint),
    owner: wallet.publicKey,
    connection,
  });

  const whitelistedCreatorsDictionary =
    pools.getWhitelistedCreatorsDictionary(pool);

  const whitelistedCreator: string | null = pools.isNFTWhitelistedByCreator(
    nft,
    whitelistedCreatorsDictionary,
  );

  const metadataInfo = whitelistedCreator
    ? await utils.deriveMetadataPubkeyFromMint(new web3.PublicKey(nft.mint))
    : new web3.PublicKey(nft.mint);

  const poolWhitelist = pool.poolWhitelist.find(({ whitelistedAddress }) => {
    return whitelistedCreator
      ? whitelistedAddress.toBase58() === whitelistedCreator
      : whitelistedAddress.toBase58() === nft.mint;
  });

  await pools.depositNftToCommunityPool({
    nftMint: new web3.PublicKey(nft.mint),
    communityPool: pool.publicKey,
    poolWhitelist: poolWhitelist.publicKey,
    nftUserTokenAccount,
    fractionMint: pool.fractionMint,
    metadataInfo,
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

  return true;
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(
  rawDepositNftToCommunityPool,
  {
    onSuccessMessage: {
      message: 'NFT deposited successfully',
    },
    onErrorMessage: { message: 'NFT depositing failed' },
  },
);

export const depositNftToCommunityPool = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
