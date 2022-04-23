/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { proposeLoan } from '@frakters/nft-lending-v2';

import {
  createTransactionFuncFromRaw,
  signAndConfirmTransaction,
  WalletAndConnection,
  wrapTxnWithTryCatch,
} from '../../../utils/transactions';
import { UserNFT } from '../../userTokens';
import { LOANS_PROGRAM_PUBKEY } from '../loans.constants';

export interface CreateLoanTransactionParams {
  nft: UserNFT;
}

export interface CreateLoanTransactionRawParams
  extends CreateLoanTransactionParams,
    WalletAndConnection {}

const rawCreateLoan = async ({
  wallet,
  connection,
  nft,
}: CreateLoanTransactionRawParams): Promise<any> => {
  const options = Provider.defaultOptions();
  const provider = new Provider(connection, wallet, options);

  await proposeLoan({
    programId: new PublicKey(LOANS_PROGRAM_PUBKEY),
    //@ts-ignore
    provider,
    user: wallet.publicKey,
    nftMint: new PublicKey(''),
    sendTxn: async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        wallet,
      });
    },
  });
};

const wrappedAsyncWithTryCatch = wrapTxnWithTryCatch(rawCreateLoan, {
  onSuccessMessage: {
    message: 'Loan created  successfully',
  },
  onErrorMessage: { message: 'Transaction failed' },
});

export const createLoan = createTransactionFuncFromRaw(
  wrappedAsyncWithTryCatch,
);
