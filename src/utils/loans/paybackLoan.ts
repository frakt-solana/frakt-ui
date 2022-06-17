import BN from 'bn.js';
import { paybackLoan as txn } from '@frakters/nft-lending-v2';
import { Provider } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

import { notify } from '../';
import { Loan } from '../../state/loans/types';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

type PaybackLoan = (props: {
  connection: Connection;
  wallet: WalletContextState;
  loan: Loan;
}) => Promise<boolean>;

export const paybackLoan: PaybackLoan = async ({
  connection,
  wallet,
  loan,
}): Promise<boolean> => {
  try {
    const options = Provider.defaultOptions();
    const provider = new Provider(connection, wallet, options);

    await txn({
      programId: new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      user: wallet.publicKey,
      admin: new PublicKey(process.env.LOANS_ADMIN_PUBKEY),
      loan: new PublicKey(loan.pubkey),
      nftMint: new PublicKey(loan.mint),
      liquidityPool: new PublicKey(loan.liquidityPool),
      collectionInfo: new PublicKey(loan.collectionInfo),
      royaltyAddress: new PublicKey(loan.royaltyAddress),
      amount: new BN(loan.repayValue * 1e9),
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
