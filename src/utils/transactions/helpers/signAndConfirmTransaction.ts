import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, Signer, Transaction } from '@solana/web3.js';

interface SignAndConfirmTransactionProps {
  transaction: Transaction;
  signers?: Signer[];
  connection: Connection;
  wallet: WalletContextState;
}

type SignAndConfirmTransaction = (
  props: SignAndConfirmTransactionProps,
) => Promise<void>;

export const signAndConfirmTransaction: SignAndConfirmTransaction = async ({
  transaction,
  signers = [],
  connection,
  wallet,
}) => {
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  if (signers.length) {
    transaction.sign(...signers);
  }

  const signedTransaction = await wallet.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    // { skipPreflight: true },
  );

  return void connection.confirmTransaction(txid);
};
