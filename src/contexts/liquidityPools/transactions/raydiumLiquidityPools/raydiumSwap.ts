import { Liquidity } from '@raydium-io/raydium-sdk';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import { notify, SOL_TOKEN } from '../../../../utils';
import { signAndConfirmTransaction } from '../../../../utils/transactions';
import {
  getCurrencyAmount,
  getTokenAccount,
} from '../../liquidityPools.helpers';
import { SwapTransactionParams } from '../../liquidityPools.model';

export const raydiumSwap =
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
  }: SwapTransactionParams): Promise<void> => {
    try {
      const tokenAccounts = (
        await Promise.all(
          [baseToken.address, quoteToken.address].map((mint) =>
            getTokenAccount({
              tokenMint: new PublicKey(mint),
              owner: walletPublicKey,
              connection,
            }),
          ),
        )
      ).filter((tokenAccount) => tokenAccount);

      const amountIn = getCurrencyAmount(baseToken, baseAmount);
      const amountOut = getCurrencyAmount(quoteToken, quoteAmount);

      const { transaction, signers } = await Liquidity.makeSwapTransaction({
        connection,
        poolKeys: poolConfig,
        userKeys: {
          tokenAccounts,
          owner: walletPublicKey,
        },
        amountIn,
        amountOut,
        fixedSide: 'in',
      });

      await signAndConfirmTransaction({
        transaction,
        signers,
        connection,
        walletPublicKey,
        signTransaction,
      });

      notify({
        message: 'Swap made successfully',
        type: 'success',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Swap failed',
        type: 'error',
      });
    }
  };
