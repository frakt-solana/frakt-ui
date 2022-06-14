import { WalletContextState } from '@solana/wallet-adapter-react';
import { lending, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../../../utils/transactions';
import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';

type ProposeLoan = (props: {
  connection: web3.Connection;
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
    const options = AnchorProvider.defaultOptions();
    const provider = new AnchorProvider(connection, wallet, options);
    const programId = new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY);

    const { loanPubkey } = await lending.proposeLoan({
      programId,
      provider,
      user: wallet.publicKey,
      nftMint: new web3.PublicKey(nftMint),
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
        const loanAccountData = lending.decodeLoan(
          accountInfo.data,
          connection,
          new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
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

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
