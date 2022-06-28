import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { captureSentryError } from '../sentry';
import { Loan } from '../../state/loans/types';
import { notify } from '../';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

type PaybackLoan = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  loan: Loan;
}) => Promise<boolean>;

export const paybackLoan: PaybackLoan = async ({
  connection,
  wallet,
  loan,
}): Promise<boolean> => {
  try {
    await loans.paybackLoan({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      user: wallet.publicKey,
      admin: new web3.PublicKey(process.env.LOANS_ADMIN_PUBKEY),
      loan: new web3.PublicKey(loan.pubkey),
      nftMint: new web3.PublicKey(loan.mint),
      liquidityPool: new web3.PublicKey(loan.liquidityPool),
      collectionInfo: new web3.PublicKey(loan.collectionInfo),
      royaltyAddress: new web3.PublicKey(loan.royaltyAddress),
      sendTxn: async (transaction) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          commitment: 'finalized',
        });
      },
    });

    notify({
      message: 'Paid back successfully!',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'The transaction just failed :( Give it another try',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'paybackLoan',
      params: { loan },
    });

    return false;
  }
};
