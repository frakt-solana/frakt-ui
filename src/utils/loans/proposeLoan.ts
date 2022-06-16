import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { BN, Provider } from '@project-serum/anchor';
import { proposeLoan as txn, decodeLoan } from '@frakters/nft-lending-v2';

import { notify, SOL_TOKEN } from '../';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

type ProposeLoan = (props: {
  connection: Connection;
  wallet: WalletContextState;
  nftMint: string;
  valuation: number; //? SOL Lamports
  loanToValue: number; //? Percent
  isPriceBased?: boolean;
}) => Promise<boolean>;

export const proposeLoan: ProposeLoan = async ({
  connection,
  wallet,
  nftMint,
  valuation,
  loanToValue,
  isPriceBased = false,
}): Promise<boolean> => {
  try {
    const options = Provider.defaultOptions();
    const provider = new Provider(connection, wallet, options);

    const { loanPubkey } = await txn({
      programId: new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      user: wallet.publicKey,
      nftMint: new PublicKey(nftMint),
      proposedNftPrice: new BN(valuation * 10 ** SOL_TOKEN.decimals),
      isPriceBased,
      loanToValue: new BN(loanToValue * 100), //? Percent 20% ==> 2000
      admin: new PublicKey(process.env.LOANS_ADMIN_PUBKEY),
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

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
