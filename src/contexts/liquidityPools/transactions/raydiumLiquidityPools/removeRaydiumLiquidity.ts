import { Liquidity } from '@raydium-io/raydium-sdk';
import { PublicKey } from '@solana/web3.js';

import { SOL_TOKEN, wrapAsyncWithTryCatch } from '../../../../utils';
import { signAndConfirmTransaction } from '../../../../utils/transactions';
import { getTokenAccount } from '../../liquidityPools.helpers';
import {
  RemoveLiquidityTransactionParams,
  WrappedLiquidityTranscationParams,
  WrapperTransactionParams,
} from '../../liquidityPools.model';

export const rowRemoveRaydiumLiquidity = async ({
  connection,
  walletPublicKey,
  signTransaction,
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

  await signAndConfirmTransaction({
    transaction,
    signers,
    connection,
    walletPublicKey,
    signTransaction,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rowRemoveRaydiumLiquidity,
  {
    onErrorMessage: 'Transaction failed',
  },
);

export const removeRaydiumLiquidity =
  ({
    connection,
    walletPublicKey,
    signTransaction,
  }: WrapperTransactionParams) =>
  (
    params: Omit<
      RemoveLiquidityTransactionParams,
      WrappedLiquidityTranscationParams
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
