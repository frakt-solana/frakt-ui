import { Liquidity } from '@raydium-io/raydium-sdk';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import { SOL_TOKEN } from '../../../../utils';
import {
  getCurrencyAmount,
  getTokenAccount,
} from '../../liquidityPools.helpers';
import { AddLiquidityTransactionParams } from '../../liquidityPools.model';

export const addRaydiumLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({
    baseToken,
    baseAmount,
    quoteToken = SOL_TOKEN,
    quoteAmount,
    poolConfig,
    fixedSide,
  }: AddLiquidityTransactionParams): Promise<void> => {
    const tokenAccounts = (
      await Promise.all(
        [baseToken.address, quoteToken.address, poolConfig.lpMint].map((mint) =>
          getTokenAccount({
            tokenMint: new PublicKey(mint),
            owner: walletPublicKey,
            connection,
          }),
        ),
      )
    ).filter((tokenAccount) => tokenAccount);

    const amountInA = getCurrencyAmount(baseToken, baseAmount);
    const amountInB = getCurrencyAmount(SOL_TOKEN, quoteAmount);

    const { transaction, signers } =
      await Liquidity.makeAddLiquidityTransaction({
        connection,
        poolKeys: poolConfig,
        userKeys: {
          tokenAccounts,
          owner: walletPublicKey,
        },
        amountInA,
        amountInB,
        fixedSide,
      });

    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPublicKey;
    transaction.sign(...signers);

    const signedTransaction = await signTransaction(transaction);
    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      // { skipPreflight: true },
    );

    return void connection.confirmTransaction(txid);
  };
