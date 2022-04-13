import { Liquidity } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { SOL_TOKEN } from '../../../../utils';
import {
  wrapTxnWithTryCatch,
  createTransactionFuncFromRaw,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { rawCreateEmptyRaydiumLiquidityPool } from './createEmptyRaydiumLiquidityPool';
import { rawInitRaydiumLiquidityPool } from './initRaydiumLiquidityPool';

export interface CreateLiquidityTransactionParams {
  baseAmount: BN;
  quoteAmount: BN;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  marketId: PublicKey;
}

export interface CreateLiquidityTransactionRawParams
  extends CreateLiquidityTransactionParams,
    WalletAndConnection {}

const rawCreateRaydiumLiquidityPool = async ({
  baseAmount,
  quoteAmount,
  baseToken,
  quoteToken = SOL_TOKEN,
  marketId,
  connection,
  wallet,
}: CreateLiquidityTransactionRawParams): Promise<void> => {
  const associatedPoolKeys = await Liquidity.getAssociatedPoolKeys({
    version: 4,
    marketId,
    baseMint: new PublicKey(baseToken.address),
    quoteMint: new PublicKey(quoteToken.address),
  });

  // const marketAccountInfo = await connection.getAccountInfo(marketId);
  // console.log(SPL_ACCOUNT_LAYOUT.decode(marketAccountInfo.data));

  await rawCreateEmptyRaydiumLiquidityPool({
    connection,
    wallet,
    associatedPoolKeys,
  });

  await rawInitRaydiumLiquidityPool({
    connection,
    wallet,
    associatedPoolKeys,
    baseToken,
    quoteToken,
    baseAmount,
    quoteAmount,
  });
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(
  rawCreateRaydiumLiquidityPool,
  {
    onSuccessMessage: {
      message: 'Liquidity pool created successfully',
    },
    onErrorMessage: { message: 'Transaction failed' },
  },
);

export const createRaydiumLiquidityPool = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
