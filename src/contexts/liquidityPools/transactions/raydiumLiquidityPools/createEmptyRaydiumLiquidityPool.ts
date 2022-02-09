import {
  Liquidity,
  LiquidityAssociatedPoolKeysV4,
} from '@raydium-io/raydium-sdk';
import { Transaction } from '@solana/web3.js';

import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';

export interface CreateEmptyRaydiumLiquidityParams {
  associatedPoolKeys?: LiquidityAssociatedPoolKeysV4;
}

export interface CreateEmptyRaydiumLiquidityRawParams
  extends CreateEmptyRaydiumLiquidityParams,
    WalletAndConnection {}

export const rawCreateEmptyRaydiumLiquidityPool = async ({
  connection,
  wallet,
  associatedPoolKeys,
}: CreateEmptyRaydiumLiquidityRawParams): Promise<void> => {
  const transaction = new Transaction();

  transaction.add(
    await Liquidity.makeCreatePoolInstruction({
      poolKeys: associatedPoolKeys,
      userKeys: {
        payer: wallet.publicKey,
      },
    }),
  );

  await signAndConfirmTransaction({
    transaction,
    connection,
    wallet,
  });
};
