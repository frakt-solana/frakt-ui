import { deriveMetadataPubkeyFromMint } from '@frakters/community-pools-client-library-v2/lib/utils/utils';
import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { depositNftToCommunityPoolIx } from '@frakters/community-pools-client-library-v2';
import { BN, Provider } from '@project-serum/anchor';
import { stakeInFusion } from '@frakters/frkt-multiple-reward';
import { pools } from '@frakt-protocol/frakt-sdk';

import { FusionPool } from '../../../../contexts/liquidityPools';
import { UserNFT } from '../../../../state/userTokens/types';
import { NftPoolData } from '../../../../utils/cacher/nftPools';
import { SELL_COMMISSION_PERCENT } from '../../constants';
import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';

type SellNftAndStake = (props: {
  wallet: WalletContextState;
  connection: Connection;
  poolToken: TokenInfo;
  pool: NftPoolData;
  inventoryFusionPool: FusionPool;
  nft: UserNFT;
}) => Promise<boolean>;

export const sellNftAndStake: SellNftAndStake = async ({
  wallet,
  connection,
  pool,
  nft,
  poolToken,
  inventoryFusionPool,
}): Promise<boolean> => {
  try {
    const depositTransaction = new Transaction();

    const { value: nftLargestAccounts } =
      await connection.getTokenLargestAccounts(new PublicKey(nft?.mint));

    const nftUserTokenAccount = nftLargestAccounts?.[0]?.address || null;

    const whitelistedCreatorsDictionary =
      pools.getWhitelistedCreatorsDictionary(pool);

    const whitelistedCreator: string | null = pools.isNFTWhitelistedByCreator(
      nft,
      whitelistedCreatorsDictionary,
    );

    const metadataInfo = whitelistedCreator
      ? await deriveMetadataPubkeyFromMint(new PublicKey(nft.mint))
      : new PublicKey(nft.mint);

    const poolWhitelist = pool.poolWhitelist.find(({ whitelistedAddress }) => {
      return whitelistedCreator
        ? whitelistedAddress.toBase58() === whitelistedCreator
        : whitelistedAddress.toBase58() === nft.mint;
    });

    const tokenMintInputFusion = new PublicKey(
      inventoryFusionPool?.router?.tokenMintInput,
    );

    const {
      instructions: depositInstructions,
      signers: depositInstructionsSigners,
    } = await depositNftToCommunityPoolIx(
      {
        communityPool: pool.publicKey,
        nftMint: new PublicKey(nft.mint),
        nftUserTokenAccount,
        poolWhitelist: poolWhitelist.publicKey,
        fractionMint: pool.fractionMint,
        metadataInfo,
        fusionProgramId: new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        tokenMintInputFusion,
        feeConfig: new PublicKey(process.env.FEE_CONFIG_GENERAL),
        adminAddress: new PublicKey(process.env.FEE_ADMIN_GENERAL),
      },
      {
        programId: new PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
        userPubkey: wallet.publicKey,
        provider: new Provider(connection, wallet, null),
      },
    );

    depositTransaction.add(...depositInstructions);

    const stakeTransaction = new Transaction();

    const stakeInstruction = await stakeInFusion(
      new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(inventoryFusionPool?.router.tokenMintInput),
      new PublicKey(inventoryFusionPool?.router.tokenMintOutput),
      new BN((1 - SELL_COMMISSION_PERCENT / 100) * 10 ** poolToken?.decimals),
    );

    stakeTransaction.add(stakeInstruction);

    const transactions = [depositTransaction, stakeTransaction];

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    depositTransaction.sign(...depositInstructionsSigners);

    const signedTransactions = await wallet.signAllTransactions(transactions);

    const txidDeposit = await connection.sendRawTransaction(
      signedTransactions[0].serialize(),
      // { skipPreflight: true },
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await connection.confirmTransaction(
      { signature: txidDeposit, blockhash, lastValidBlockHeight },
      'finalized',
    );

    const txidStake = await connection.sendRawTransaction(
      signedTransactions[1].serialize(),
      // { skipPreflight: true },
    );

    await connection.confirmTransaction(
      { signature: txidStake, blockhash, lastValidBlockHeight },
      'finalized',
    );

    notify({
      message: 'Staked successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Stake failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
