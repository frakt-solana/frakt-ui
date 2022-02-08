import { Liquidity } from '@raydium-io/raydium-sdk';
import { PublicKey } from '@solana/web3.js';

import { SOL_TOKEN, wrapAsyncWithTryCatch } from '../../../../utils';
import {
  CreateLiquidityTransactionParams,
  WrappedLiquidityTranscationParams,
  WrapperTransactionParams,
} from '../../liquidityPools.model';
import { createEmptyRaydiumLiquidityPool } from './createEmptyRaydiumLiquidityPool';
import { initRaydiumLiquidityPool } from './initRaydiumLiquidityPool';

const rowCreateRaydiumLiquidityPool = async ({
  baseAmount,
  quoteAmount,
  baseToken,
  quoteToken = SOL_TOKEN,
  marketId,
  connection,
  walletPublicKey,
  signTransaction,
}: CreateLiquidityTransactionParams): Promise<void> => {
  const associatedPoolKeys = await Liquidity.getAssociatedPoolKeys({
    version: 4,
    marketId,
    baseMint: new PublicKey(baseToken.address),
    quoteMint: new PublicKey(quoteToken.address),
  });

  // const marketAccountInfo = await connection.getAccountInfo(marketId);
  // console.log(SPL_ACCOUNT_LAYOUT.decode(marketAccountInfo.data));

  await createEmptyRaydiumLiquidityPool({
    connection,
    walletPublicKey,
    signTransaction,
    associatedPoolKeys,
  });

  await initRaydiumLiquidityPool({
    connection,
    walletPublicKey,
    signTransaction,
    associatedPoolKeys,
    baseToken,
    quoteToken,
    baseAmount,
    quoteAmount,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rowCreateRaydiumLiquidityPool,
  {
    onSuccessMessage: 'Liquidity pool created',
    onErrorMessage: 'Transaction failed',
  },
);

export const createRaydiumLiquidityPool =
  ({
    connection,
    walletPublicKey,
    signTransaction,
  }: WrapperTransactionParams) =>
  (
    params: Omit<
      CreateLiquidityTransactionParams,
      WrappedLiquidityTranscationParams
    >,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
