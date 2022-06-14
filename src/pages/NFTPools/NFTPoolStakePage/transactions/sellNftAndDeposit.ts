import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  utils,
  pools,
  raydium,
  AnchorProvider,
  BN,
  web3,
} from '@frakt-protocol/frakt-sdk';

import {
  FusionPool,
  RaydiumPoolInfo,
} from '../../../../contexts/liquidityPools';
import { notify, SOL_TOKEN } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';
import { SELL_COMMISSION_PERCENT } from '../../constants';
import { calcRatio } from '../components';
import { NftPoolData } from '../../../../utils/cacher/nftPools';
import { UserNFT } from '../../../../state/userTokens/types';

type SellNftAndDeposit = (props: {
  wallet: WalletContextState;
  connection: web3.Connection;
  poolToken: TokenInfo;
  pool: NftPoolData;
  liquidityFusionPool: FusionPool;
  nft: UserNFT;
  raydiumLiquidityPoolKeys: raydium.LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
}) => Promise<boolean>;

export const sellNftAndDeposit: SellNftAndDeposit = async ({
  wallet,
  connection,
  pool,
  nft,
  poolToken,
  liquidityFusionPool,
  raydiumLiquidityPoolKeys,
  raydiumPoolInfo,
}): Promise<boolean> => {
  try {
    const depositTransaction = new web3.Transaction();

    const { value: nftLargestAccounts } =
      await connection.getTokenLargestAccounts(new web3.PublicKey(nft?.mint));

    const nftUserTokenAccount = nftLargestAccounts?.[0]?.address || null;

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

    const tokenMintInputFusion = new web3.PublicKey(
      liquidityFusionPool?.router?.tokenMintInput,
    );

    const {
      instructions: depositInstructions,
      signers: depositInstructionsSigners,
    } = await pools.depositNftToCommunityPoolIx({
      communityPool: pool.publicKey,
      nftMint: new web3.PublicKey(nft.mint),
      nftUserTokenAccount,
      poolWhitelist: poolWhitelist.publicKey,
      fractionMint: pool.fractionMint,
      metadataInfo,
      fusionProgramId: new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      tokenMintInputFusion,
      feeConfig: new web3.PublicKey(process.env.FEE_CONFIG_GENERAL),
      adminAddress: new web3.PublicKey(process.env.FEE_ADMIN_GENERAL),
      programId: new web3.PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
      userPubkey: wallet.publicKey,
      provider: new AnchorProvider(connection, wallet, null),
    });

    depositTransaction.add(...depositInstructions);

    const tokenAccounts = (
      await Promise.all(
        [
          poolToken.address,
          SOL_TOKEN.address,
          raydiumLiquidityPoolKeys.lpMint,
        ].map((mint) =>
          utils.getTokenAccount({
            tokenMint: new web3.PublicKey(mint),
            owner: wallet.publicKey,
            connection,
          }),
        ),
      )
    ).filter((tokenAccount) => tokenAccount);

    const poolTokenAmount = 1 - SELL_COMMISSION_PERCENT / 100;
    const poolTokenAmountBN = new BN(
      poolTokenAmount * 10 ** poolToken?.decimals,
    );

    const solTokenAmount = poolTokenAmount * calcRatio(raydiumPoolInfo);

    const solTokenAmountBN = new BN(solTokenAmount * 10 ** SOL_TOKEN?.decimals);

    const amountInA = pools.getCurrencyAmount(poolToken, poolTokenAmountBN);
    const amountInB = pools.getCurrencyAmount(SOL_TOKEN, solTokenAmountBN);

    const {
      transaction: addLiquidityTransaction,
      signers: addLiquidityTransactionSigners,
    } = await raydium.Liquidity.makeAddLiquidityTransaction({
      connection,
      poolKeys: raydiumLiquidityPoolKeys,
      userKeys: {
        tokenAccounts,
        owner: wallet.publicKey,
      },
      amountInA,
      amountInB,
      fixedSide: 'b',
    });

    const transactions = [depositTransaction, addLiquidityTransaction];

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    depositTransaction.sign(...depositInstructionsSigners);
    addLiquidityTransaction.sign(...addLiquidityTransactionSigners);

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

    const txidAddLiquidity = await connection.sendRawTransaction(
      signedTransactions[1].serialize(),
      // { skipPreflight: true },
    );

    await connection.confirmTransaction(
      { signature: txidAddLiquidity, blockhash, lastValidBlockHeight },
      'finalized',
    );

    notify({
      message: 'Liquidity provided successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Liquidity providing failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
