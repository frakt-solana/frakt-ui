import { Liquidity } from '@raydium-io/raydium-sdk';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import { SOL_TOKEN } from '../../../../utils';
import { getTokenAccount } from '../../liquidityPools.helpers';
import { RemoveLiquidityTransactionParams } from '../../liquidityPools.model';

export const removeRaydiumLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({
    baseToken,
    quoteToken = SOL_TOKEN,
    poolConfig,
    amount,
  }: RemoveLiquidityTransactionParams): Promise<void> => {
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

    const { transaction, signers } =
      await Liquidity.makeRemoveLiquidityTransaction({
        connection,
        poolKeys: poolConfig,
        userKeys: {
          tokenAccounts: tokenAccounts,
          owner: walletPublicKey,
        },
        amountIn: amount,
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
