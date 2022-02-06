import { Connection, PublicKey, Signer, Transaction } from '@solana/web3.js';

interface SignAndConfirmTransactionProps {
  transaction: Transaction;
  signers?: Signer[];
  connection: Connection;
  walletPublicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

type SignAndConfirmTransaction = (
  props: SignAndConfirmTransactionProps,
) => Promise<void>;

export const signAndConfirmTransaction: SignAndConfirmTransaction = async ({
  transaction,
  signers = [],
  connection,
  walletPublicKey,
  signTransaction,
}) => {
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = walletPublicKey;

  if (signers.length) {
    transaction.sign(...signers);
  }

  const signedTransaction = await signTransaction(transaction);
  const txid = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    // { skipPreflight: true },
  );

  return void connection.confirmTransaction(txid);
};
