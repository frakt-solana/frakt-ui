import { Liquidity } from '@raydium-io/raydium-sdk';
import { PublicKey } from '@solana/web3.js';

import { SOL_TOKEN, wrapAsyncWithTryCatch } from '../../../../utils';
import { signAndConfirmTransaction } from '../../../../utils/transactions';
import {
  getCurrencyAmount,
  getTokenAccount,
} from '../../liquidityPools.helpers';
import {
  AddLiquidityTransactionParams,
  WrappedLiquidityTranscationParams,
  WrapperTransactionParams,
} from '../../liquidityPools.model';

const rowAddRaydiumLiquidity = async ({
  connection,
  walletPublicKey,
  signTransaction,
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

  const { transaction, signers } = await Liquidity.makeAddLiquidityTransaction({
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

  await signAndConfirmTransaction({
    transaction,
    signers,
    connection,
    walletPublicKey,
    signTransaction,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(rowAddRaydiumLiquidity, {
  onSuccessMessage: 'successfully',
  onErrorMessage: 'Transaction failed',
});

export const addRaydiumLiquidity =
  ({
    connection,
    walletPublicKey,
    signTransaction,
  }: WrapperTransactionParams) =>
  (
    params: Omit<
      AddLiquidityTransactionParams,
      WrappedLiquidityTranscationParams
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
