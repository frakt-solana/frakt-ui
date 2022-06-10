import { getLotteryTicketIx } from '@frakters/community-pools-client-library-v2';
import { Provider } from '@project-serum/anchor';
import { Liquidity, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import { utils, pools } from '@frakt-protocol/frakt-sdk';

import { notify, SOL_TOKEN } from '../../../utils';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import { NotifyType } from '../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../utils/transactions';
import { getTokenPrice } from '../helpers';

type BuyRandomNft = (props: {
  pool: NftPoolData;
  poolToken: TokenInfo;
  connection: Connection;
  wallet: WalletContextState;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
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
                tokenMint: new PublicKey(mint),
                owner: wallet.publicKey,
                connection,
              }),
            ),
          )
        ).filter((tokenAccount) => tokenAccount);

        const amountIn = pools.getCurrencyAmount(SOL_TOKEN, solAmountBN);
        const amountOut = pools.getCurrencyAmount(poolToken, poolTokenAmountBN);

        const { transaction: swapTransaction, signers: swapTransationSigners } =
          await Liquidity.makeSwapTransaction({
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
    } = await getLotteryTicketIx(
      {
        communityPool: pool.publicKey,
        userFractionsTokenAccount,
        fractionMint: pool.fractionMint,
        fusionProgramId: new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        tokenMintInputFusion: raydiumLiquidityPoolKeys?.lpMint,
        feeConfig: new PublicKey(process.env.FEE_CONFIG_GENERAL),
        adminAddress: new PublicKey(process.env.FEE_ADMIN_GENERAL),
      },
      {
        programId: new PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
        userPubkey: wallet.publicKey,
        provider: new Provider(connection, wallet, null),
      },
    );

    const getLotteryTicketTransaction = new Transaction();
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

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
