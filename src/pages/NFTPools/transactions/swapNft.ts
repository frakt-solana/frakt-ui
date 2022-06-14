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

import { UserNFT } from '../../../state/userTokens/types';
import { notify, SOL_TOKEN } from '../../../utils';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import { NotifyType } from '../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../utils/transactions';
import { SELL_COMMISSION_PERCENT } from '../constants';
import { getTokenPrice } from '../helpers';

type SwapNft = (props: {
  pool: NftPoolData;
  poolToken: TokenInfo;
  connection: web3.Connection;
  nft: UserNFT;
  wallet: WalletContextState;
  raydiumLiquidityPoolKeys: raydium.LiquidityPoolKeysV4;
  needSwap?: boolean;
  swapSlippage?: number;
}) => Promise<boolean>;

export const swapNft: SwapNft = async ({
  pool,
  poolToken,
  nft,
  connection,
  wallet,
  raydiumLiquidityPoolKeys,
  swapSlippage,
  needSwap = false,
}) => {
  try {
    const { swapTransaction, swapTransationSigners } = await (async () => {
      if (needSwap) {
        const { amountWithSlippage: solAmount } = await getTokenPrice({
          poolData: {
            tokenInfo: poolToken,
            poolConfig: raydiumLiquidityPoolKeys,
          },
          slippage: swapSlippage || 1,
          isBuy: true,
          connection,
        });

        const solAmountBN = new BN(
          parseFloat(solAmount) *
            (SELL_COMMISSION_PERCENT / 100) *
            10 ** SOL_TOKEN.decimals,
        );

        const poolTokenAmountBN = new BN(
          (SELL_COMMISSION_PERCENT / 100) * 10 ** poolToken.decimals,
        );

        const tokenAccounts = (
          await Promise.all(
            [SOL_TOKEN.address, poolToken.address].map((mint) =>
              utils.getTokenAccount({
                tokenMint: new web3.PublicKey(mint),
                owner: wallet.publicKey,
                connection,
              }),
            ),
          )
        ).filter((tokenAccount) => tokenAccount);

        const amountIn = pools.getCurrencyAmount(SOL_TOKEN, solAmountBN);
        const amountOut = pools.getCurrencyAmount(poolToken, poolTokenAmountBN);

        const { transaction: swapTransaction, signers: swapTransationSigners } =
          await raydium.Liquidity.makeSwapTransaction({
            connection,
            poolKeys: raydiumLiquidityPoolKeys,
            userKeys: {
              tokenAccounts,
              owner: wallet.publicKey,
            },
            amountIn,
            amountOut,
            fixedSide: 'out',
          });

        return {
          swapTransaction,
          swapTransationSigners,
        };
      }

      return {
        swapTransaction: null,
        swapTransationSigners: null,
      };
    })();

    const { pubkey: userFractionsTokenAccount } = await utils.getTokenAccount({
      tokenMint: pool.fractionMint,
      owner: wallet.publicKey,
      connection,
    });

    const {
      instructions: getLotteryTicketInstructions,
      signers: getLotteryTicketSigners,
    } = await pools.getLotteryTicketIx({
      communityPool: pool.publicKey,
      userFractionsTokenAccount,
      fractionMint: pool.fractionMint,
      fusionProgramId: new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      tokenMintInputFusion: raydiumLiquidityPoolKeys?.lpMint,
      feeConfig: new web3.PublicKey(process.env.FEE_CONFIG_GENERAL),
      adminAddress: new web3.PublicKey(process.env.FEE_ADMIN_GENERAL),
      programId: new web3.PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
      userPubkey: wallet.publicKey,
      provider: new AnchorProvider(connection, wallet, null),
    });

    const getLotteryTicketTransaction = new web3.Transaction();
    getLotteryTicketTransaction.add(...getLotteryTicketInstructions);

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

    const { instructions: depositNftInstructions, signers: depositNftSigners } =
      await pools.depositNftToCommunityPoolIx({
        nftMint: new web3.PublicKey(nft.mint),
        communityPool: pool.publicKey,
        poolWhitelist: poolWhitelist.publicKey,
        nftUserTokenAccount,
        fractionMint: pool.fractionMint,
        metadataInfo,
        fusionProgramId: new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        tokenMintInputFusion: raydiumLiquidityPoolKeys?.lpMint,
        feeConfig: new web3.PublicKey(process.env.FEE_CONFIG_GENERAL),
        adminAddress: new web3.PublicKey(process.env.FEE_ADMIN_GENERAL),
        programId: new web3.PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
        userPubkey: wallet.publicKey,
        provider: new AnchorProvider(connection, wallet, null),
      });
    const depositNftTransaction = new web3.Transaction();
    depositNftTransaction.add(...depositNftInstructions);

    const transactions = [
      depositNftTransaction,
      needSwap && swapTransaction,
      getLotteryTicketTransaction,
    ].filter((txn) => txn);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    depositNftTransaction.sign(...depositNftSigners);
    needSwap && swapTransaction.sign(...swapTransationSigners);
    getLotteryTicketTransaction.sign(...getLotteryTicketSigners);

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

    if (needSwap) {
      const txidSwap = await connection.sendRawTransaction(
        signedTransactions[1].serialize(),
      );

      await connection.confirmTransaction(
        { signature: txidSwap, blockhash, lastValidBlockHeight },
        'finalized',
      );
    }

    const txidGetLotteryTicket = await connection.sendRawTransaction(
      signedTransactions[signedTransactions.length - 1].serialize(),
      // { skipPreflight: true },
    );

    await connection.confirmTransaction(
      { signature: txidGetLotteryTicket, blockhash, lastValidBlockHeight },
      'finalized',
    );

    notify({
      message: 'Swap made successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Swap failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
