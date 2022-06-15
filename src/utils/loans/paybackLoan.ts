import { WalletContextState } from '@solana/wallet-adapter-react';
import { lending, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

import { notify } from '../';
import { LoanView } from '../../state/loans/types';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

type PaybackLoan = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  loan: LoanView;
}) => Promise<boolean>;

export const paybackLoan: PaybackLoan = async ({
  connection,
  wallet,
  loan,
}): Promise<boolean> => {
  try {
    const options = AnchorProvider.defaultOptions();
    const provider = new AnchorProvider(connection, wallet, options);

    await lending.paybackLoan({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      user: wallet.publicKey,
      admin: new web3.PublicKey(process.env.LOANS_ADMIN_PUBKEY),
      loan: new web3.PublicKey(loan.loanPubkey),
      nftMint: new web3.PublicKey(loan.nftMint),
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

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
