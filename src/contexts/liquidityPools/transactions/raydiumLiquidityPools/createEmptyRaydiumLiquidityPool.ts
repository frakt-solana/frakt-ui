import {
  Liquidity,
  LiquidityAssociatedPoolKeysV4,
} from '@raydium-io/raydium-sdk';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import { notify } from '../../../../utils';

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

  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = walletPublicKey;

  const signedTransaction = await signTransaction(transaction);
  const txid = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    // { skipPreflight: true },
  );

  notify({
    message: 'Liquidity pool created',
    type: 'success',
  });

  return void connection.confirmTransaction(txid);
};
