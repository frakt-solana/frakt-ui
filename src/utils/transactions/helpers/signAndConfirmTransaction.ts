import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';

interface SignAndConfirmTransactionProps {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
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
