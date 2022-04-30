import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { proposeLoan as txn } from '@frakters/nft-lending-v2';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../../../utils/transactions';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';

type ProposeLoan = (props: {
  connection: Connection;
  wallet: WalletContextState;
  nftMint: string;
}) => Promise<boolean>;

export const proposeLoan: ProposeLoan = async ({
  connection,
  wallet,
  nftMint,
}): Promise<boolean> => {
  try {
    const options = Provider.defaultOptions();
    const provider = new Provider(connection, wallet, options);

    await txn({
      programId: new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      user: wallet.publicKey,
      nftMint: new PublicKey(nftMint),
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          signers,
          connection,
          wallet,
        });
      },
    });

    notify({
      message: 'Loan proposed successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Loan proposing failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
