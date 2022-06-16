import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { proposeLoan as txn, decodeLoan } from '@frakters/nft-lending-v2';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../../../utils/transactions';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import { captureSentryError } from '../../../utils/sentry';

type ProposeLoan = (props: {
  connection: Connection;
  wallet: WalletContextState;
  nftMint: string;
  proposedNftPrice: number;
}) => Promise<boolean>;

export const proposeLoan: ProposeLoan = async ({
  connection,
  wallet,
  nftMint,
  proposedNftPrice,
}): Promise<boolean> => {
  try {
    const options = Provider.defaultOptions();
    const provider = new Provider(connection, wallet, options);
    const programId = new PublicKey(process.env.LOANS_PROGRAM_PUBKEY);

    const { loanPubkey } = await txn({
      programId,
      provider,
      user: wallet.publicKey,
      nftMint: new PublicKey(nftMint),
      proposedNftPrice: proposedNftPrice,
      isPriceBased: false,
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          signers,
          connection,
          wallet,
          commitment: 'confirmed',
        });
      },
    });

    const subscribtionId = connection.onAccountChange(
      loanPubkey,
      (accountInfo) => {
        const loanAccountData = decodeLoan(
          accountInfo.data,
          connection,
          new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        );

        if (loanAccountData?.loanStatus?.activated) {
          notify({
            message: 'Your loan was successfully funded!',
            type: NotifyType.SUCCESS,
          });
        } else if (loanAccountData?.loanStatus?.rejected) {
          notify({
            message: 'Loan funding failed. Please get in touch with us',
            type: NotifyType.ERROR,
          });
        }
        connection.removeAccountChangeListener(subscribtionId);
      },
    );

    notify({
      message:
        'We are collateralizing your jpeg. It should take less than a minute',
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

    captureSentryError({ error, wallet, transactionName: 'proposeLoan' });

    return false;
  }
};
