import {
  web3,
  pools,
  utils,
  raydium,
  BN,
  AnchorProvider,
  TokenInfo,
} from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { notify, SOL_TOKEN } from '../../../utils';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import { captureSentryError } from '../../../utils/sentry';
import { NotifyType } from '../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../utils/transactions';
import { getTokenPrice } from '../helpers';

type BuyRandomNft = (props: {
  pool: NftPoolData;
  poolToken: TokenInfo;
  connection: web3.Connection;
  wallet: WalletContextState;
  raydiumLiquidityPoolKeys: raydium.LiquidityPoolKeysV4;
  needSwap?: boolean;
  swapSlippage?: number;
}) => Promise<boolean>;

export const buyRandomNft: BuyRandomNft = async ({
  pool,
  poolToken,
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
          parseFloat(solAmount) * 10 ** SOL_TOKEN.decimals,
        );

        const poolTokenAmountBN = new BN(10 ** poolToken?.decimals);

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

    const userFractionsTokenAccount =
      await raydium.Spl.getAssociatedTokenAccount({
        mint: pool.fractionMint,
        owner: wallet.publicKey,
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

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    if (needSwap) {
      const transactions = [swapTransaction, getLotteryTicketTransaction];
      transactions.forEach((transaction) => {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
      });
      swapTransaction.sign(...swapTransationSigners);
      getLotteryTicketTransaction.sign(...getLotteryTicketSigners);

      const signedTransactions = await wallet.signAllTransactions(transactions);

      const txidSwap = await connection.sendRawTransaction(
        signedTransactions[0].serialize(),
        // { skipPreflight: true },
      );

      notify({
        message: 'Transactions sent',
        type: NotifyType.INFO,
      });

      await connection.confirmTransaction(
        { signature: txidSwap, blockhash, lastValidBlockHeight },
        'finalized',
      );

      const txidGetLotteryTicket = await connection.sendRawTransaction(
        signedTransactions[1].serialize(),
        // { skipPreflight: true },
      );

      await connection.confirmTransaction(
        { signature: txidGetLotteryTicket, blockhash, lastValidBlockHeight },
        'finalized',
      );
    } else {
      getLotteryTicketTransaction.recentBlockhash = blockhash;
      getLotteryTicketTransaction.feePayer = wallet.publicKey;
      getLotteryTicketTransaction.sign(...getLotteryTicketSigners);

      const signedTransaction = await wallet.signTransaction(
        getLotteryTicketTransaction,
      );

      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        // { skipPreflight: true },
      );

      notify({
        message: 'Transaction sent',
        type: NotifyType.INFO,
      });

      await connection.confirmTransaction(
        { signature: txid, blockhash, lastValidBlockHeight },
        'finalized',
      );
    }

    notify({
      message: 'Buy made successfully',
      description: 'You will receive your NFT shortly',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Buy failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({ error, wallet, transactionName: 'buyRandomNft' });

    return false;
  }
};
