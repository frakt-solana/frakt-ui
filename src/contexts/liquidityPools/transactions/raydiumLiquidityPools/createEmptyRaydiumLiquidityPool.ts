import { Liquidity } from '@raydium-io/raydium-sdk';
import { Transaction } from '@solana/web3.js';

import { wrapAsyncWithTryCatch } from '../../../../utils';
import { signAndConfirmTransaction } from '../../../../utils/transactions';
import {
  createEmptyRaydiumLiquidityParams,
  WrappedLiquidityTranscationParams,
} from '../../liquidityPools.model';

const rowCreateEmptyRaydiumLiquidityPool = async ({
  connection,
  walletPublicKey,
  signTransaction,
  associatedPoolKeys,
}: createEmptyRaydiumLiquidityParams): Promise<void> => {
  const transaction = new Transaction();

  transaction.add(
    await Liquidity.makeCreatePoolInstruction({
      poolKeys: associatedPoolKeys,
      userKeys: {
        payer: walletPublicKey,
      },
    }),
  );

  await signAndConfirmTransaction({
    transaction,
    connection,
    walletPublicKey,
    signTransaction,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rowCreateEmptyRaydiumLiquidityPool,
  {
    onSuccessMessage: 'Liquidity pool created',
    onErrorMessage: 'Transaction failed',
  },
);

export const createEmptyRaydiumLiquidityPool =
  ({
    connection,
    walletPublicKey,
    signTransaction,
    associatedPoolKeys,
  }: createEmptyRaydiumLiquidityParams) =>
  (
    params: Omit<
      createEmptyRaydiumLiquidityParams,
      WrappedLiquidityTranscationParams
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      associatedPoolKeys,
      ...params,
    });
