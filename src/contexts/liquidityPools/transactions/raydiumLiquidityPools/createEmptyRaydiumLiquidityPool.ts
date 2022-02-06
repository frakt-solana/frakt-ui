import {
  Liquidity,
  LiquidityAssociatedPoolKeysV4,
} from '@raydium-io/raydium-sdk';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { signAndConfirmTransaction } from '../../../../utils/transactions';

export const createEmptyRaydiumLiquidityPool = async ({
  connection,
  walletPublicKey,
  signTransaction,
  associatedPoolKeys,
}: {
  connection: Connection;
  walletPublicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  associatedPoolKeys: LiquidityAssociatedPoolKeysV4;
}): Promise<void> => {
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

  notify({
    message: 'Liquidity pool created',
    type: NotifyType.SUCCESS,
  });
};
