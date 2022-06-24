import { web3, raydium } from '@frakt-protocol/frakt-sdk';

import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';

export interface CreateEmptyRaydiumLiquidityParams {
  associatedPoolKeys?: raydium.LiquidityAssociatedPoolKeysV4;
}

export interface CreateEmptyRaydiumLiquidityRawParams
  extends CreateEmptyRaydiumLiquidityParams,
    WalletAndConnection {}

export const rawCreateEmptyRaydiumLiquidityPool = async ({
  connection,
  wallet,
  associatedPoolKeys,
}: CreateEmptyRaydiumLiquidityRawParams): Promise<void> => {
  const transaction = new web3.Transaction();

  transaction.add(
    await raydium.Liquidity.makeCreatePoolInstruction({
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
