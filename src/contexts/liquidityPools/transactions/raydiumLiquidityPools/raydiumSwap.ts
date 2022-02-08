import { Liquidity } from '@raydium-io/raydium-sdk';
import { PublicKey } from '@solana/web3.js';

import { SOL_TOKEN, wrapAsyncWithTryCatch } from '../../../../utils';
import { signAndConfirmTransaction } from '../../../../utils/transactions';
import {
  getCurrencyAmount,
  getTokenAccount,
} from '../../liquidityPools.helpers';
import {
  SwapTransactionParams,
  WrappedLiquidityTranscationParams,
  WrapperTransactionParams,
} from '../../liquidityPools.model';

export const rowRaydiumSwap = async ({
  baseToken,
  baseAmount,
  quoteToken = SOL_TOKEN,
  quoteAmount,
  poolConfig,
  connection,
  walletPublicKey,
  signTransaction,
}: SwapTransactionParams): Promise<void> => {
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
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowRaydiumSwap, {
  onSuccessMessage: 'Swap made successfully',
  onErrorMessage: 'Swap failed',
});

export const raydiumSwap =
  ({
    connection,
    walletPublicKey,
    signTransaction,
  }: WrapperTransactionParams) =>
  (
    params: Omit<SwapTransactionParams, WrappedLiquidityTranscationParams>,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
