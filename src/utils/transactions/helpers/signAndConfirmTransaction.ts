import { WalletContextState } from '@solana/wallet-adapter-react';
import { Commitment, Connection, Signer, Transaction } from '@solana/web3.js';

import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';

interface SignAndConfirmTransactionProps {
  transaction: Transaction;
  signers?: Signer[];
  connection: Connection;
  wallet: WalletContextState;
  commitment?: Commitment;
}

type SignAndConfirmTransaction = (
  props: SignAndConfirmTransactionProps,
) => Promise<void>;

export const signAndConfirmTransaction: SignAndConfirmTransaction = async ({
  transaction,
  signers = [],
  connection,
  wallet,
  commitment = 'finalized',
}) => {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

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

  notify({
    message: 'Transaction sent',
    // description: onSuccessMessage?.description,
    type: NotifyType.INFO,
  });

  await connection.confirmTransaction(
    {
      signature: txid,
      blockhash,
      lastValidBlockHeight,
    },
    commitment,
  );
};
