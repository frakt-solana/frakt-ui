import { Liquidity } from '@raydium-io/raydium-sdk';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import { notify, SOL_TOKEN } from '../../../../utils';
import { CreateLiquidityTransactionParams } from '../../liquidityPools.model';
import { createEmptyRaydiumLiquidityPool } from './createEmptyRaydiumLiquidityPool';
import { initRaydiumLiquidityPool } from './initRaydiumLiquidityPool';

export const createRaydiumLiquidityPool =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({
    baseAmount,
    quoteAmount,
    baseToken,
    quoteToken = SOL_TOKEN,
    marketId,
  }: CreateLiquidityTransactionParams): Promise<void> => {
    try {
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: 'error',
      });
    }
  };
